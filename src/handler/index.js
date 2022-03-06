const {AWSLambdaServer, SlashCreator} = require('slash-create');

const COMMANDS_DIR = '/opt/nodejs/commands';

const creator = new SlashCreator({
    applicationID: process.env.DISCORD_APP_ID,
    publicKey: process.env.DISCORD_PUBLIC_KEY
});

creator
    .withServer(new AWSLambdaServer(module.exports, 'lambdaHandler'))
    .registerCommandsIn(COMMANDS_DIR);

creator.on('debug', console.log);
creator.on('warn', console.log);
creator.on('error', console.log);
creator.on('rawREST', (request) => {
    console.log("Request:", JSON.stringify(request.body));
});
