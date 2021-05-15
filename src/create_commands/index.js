const {once} = require('events');

const {SecretsManagerClient, GetSecretValueCommand} = require('@aws-sdk/client-secrets-manager');
const CfnLambda = require('cfn-lambda');
const {SlashCreator} = require('slash-create');

const HelloCommand = require("./commands/hello_command");

const secretsClient = new SecretsManagerClient({});

exports.lambdaHandler = CfnLambda({
    AsyncCreate: handleCreateAsync
    // we do nothing at update or delete - commands should persist
});

async function handleCreateAsync(cfnRequestParams) {
    console.log("CREATE");

    const credentials = await getCredentials();
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

    return {
        PhysicalResourceId: "TEST"
    }
}

async function getCredentials() {
    const params = {
        SecretId: process.env.BOT_TOKEN_SECRET_ARN
    };

    console.log("Getting Discord credentials...\nSecretId:", params.SecretId);
    const command = new GetSecretValueCommand(params);

    let parsedData;

    try {
        const data = await secretsClient.send(command);
        parsedData = JSON.parse(data.SecretString);
    } catch (err) {
        console.log("Error retrieving credentials.");
        throw err;
    }

    const appId = parsedData['appId'];
    const botToken = parsedData['botToken'];
    const publicKey = parsedData['publicKey'];

    if (!appId || !botToken || !publicKey) {
        throw new Error("Missing App ID, Bot Token or public key value.")
    }

    return {
        appId,
        botToken,
        publicKey
    };
}
