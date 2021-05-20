const {once} = require('events');
const CfnLambda = require('cfn-lambda');
const {getCredentials} = require('./secretsHelper');

// included in commands layer
const {SlashCreator} = require('slash-create');
const HelloCommand = require('/opt/nodejs/commands/helloCommand');

exports.lambdaHandler = CfnLambda({
    AsyncCreate: handleCreateAsync,
    AsyncUpdate: handleUpdateAsync,
    AsyncDelete: handleDeleteAsync
});

async function handleCreateAsync() {
    console.log("CREATE");
    return handleCreateOrUpdate();
}

async function handleUpdateAsync() {
    console.log("UPDATE");
    return handleCreateOrUpdate();
}

async function handleDeleteAsync() {
    const credentials = await getCredentials(process.env.BOT_TOKEN_SECRET_ARN);

    // do nothing here - commands should persist
    // (note that global commands take up to 1 hour to update)

    return {
        PhysicalResourceId: "SlashCommands:" + credentials.appId
    }
}

async function handleCreateOrUpdate() {
    try {
        const credentials = await getCredentials(process.env.BOT_TOKEN_SECRET_ARN);
        await createCommands(credentials);

        return {
            PhysicalResourceId: "SlashCommands:" + credentials.appId
        }
    } catch (err) {
        console.log(err.stack);
        throw err;
    }
}

async function createCommands(credentials) {
    const creator = new SlashCreator({
        applicationID: credentials.appId,
        publicKey: credentials.publicKey,
        token: credentials.botToken
    });

    creator.on('debug', console.log);
    creator.on('warn', console.log);
    creator.on('error', console.log);
    creator.on('rawREST', (request) => {
        console.log("Request:", JSON.stringify(request.body));
    });

    creator
        .registerCommand(HelloCommand)
        .syncCommands();

    // note that syncCommands() is asynchronous
    await once(creator, 'synced');
}
