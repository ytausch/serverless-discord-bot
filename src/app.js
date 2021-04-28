exports.lambdaHandler = async (event) => {
    console.log('Received event:', JSON.stringify(event));

    const requestBody = JSON.parse(event.body);
    const name = requestBody?.name ?? "Anonymous";

    const publicKey = process.env.DISCORD_PUBLIC_KEY

    return {
        statusCode: 200,
        body: JSON.stringify({
            value: publicKey,
        })
    }
}
