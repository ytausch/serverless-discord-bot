const {InteractionType, InteractionResponseType, verifyKey} = require("discord-interactions");

const ANSWER_UNAUTHORIZED = {
    statusCode: 401,
    body: JSON.stringify({
        error: 'Bad request signature',
    })
};

exports.lambdaHandler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    const publicKey = process.env.DISCORD_PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];

    const isValidRequest = verifyKey(event.body, signature, timestamp, publicKey);

    if (!isValidRequest) {
        console.log('[UNAUTHORIZED]');
        return ANSWER_UNAUTHORIZED;
    }

    const jsonBody = JSON.parse(event.body);
    if (jsonBody.type === InteractionType.PING) {
        console.log('PONG');
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: InteractionResponseType.PONG,
            })
        }
    }

    // dummy response
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                "tts": false,
                "content": 'Beep Boop :robot:',
                "embeds": [],
                "allowed_mentions": [],
            }
        })
    }
};
