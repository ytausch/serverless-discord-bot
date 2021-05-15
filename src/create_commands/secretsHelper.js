const {SecretsManagerClient, GetSecretValueCommand} = require('@aws-sdk/client-secrets-manager');

const secretsClient = new SecretsManagerClient({});

exports.getCredentials = async function (secretArn) {
    const params = {
        SecretId: secretArn
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
};
