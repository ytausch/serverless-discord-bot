const {InteractionType, InteractionResponseType, verifyKey} = require("discord-interactions");

exports.lambdaHandler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    const publicKey = process.env.DISCORD_PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];

    const isValidRequest = verifyKey(event.body, signature, timestamp, publicKey);

    if (!isValidRequest) {
        console.log('[UNAUTHORIZED]');
        return answerError(401, "Bad request signature.");
    }

    const interaction = JSON.parse(event.body);
    return handleInteraction(interaction);
};

function handleInteraction(interaction) {
    if (interaction.type === InteractionType.PING) {
        return handlePingPong();
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        return handleAppCommand(interaction)
    }

    return answerError(501, "Unknown interaction type.")
}

function handlePingPong() {
    console.log('PONG');
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: InteractionResponseType.PONG,
        })
    }
}

function handleAppCommand(interaction) {
    if (interaction.data.name === "hello") {
        console.log("/hello");
        return answerResponse("Hi there, " + interaction.member.user.username + " :robot:")
    }

    return answerError(501, "Unknown application command.")
}

function answerResponse(content) {
    const answer = {
        statusCode: 200,
        body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                tts: false,
                content,
                embeds: [],
                allowedMentions: []
            }
        })
    };

    console.log("Sending response: ", JSON.stringify(answer));

    return answer;
}

function answerError(httpStatus, errorText) {
    const answer = {
        statusCode: httpStatus,
        body: JSON.stringify({
            error: errorText
        })
    };

    console.log("Sending response: ", JSON.stringify(answer));

    return answer;
}
