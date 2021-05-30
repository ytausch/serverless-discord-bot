const {SlashCommand} = require('slash-create');

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'hello',
            description: 'Says hello to you.',
            guildIDs: ['SET_YOUR_TEST_GUILD_ID_HERE']
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        return `Hello, ${ctx.user.username}`;
    }
};
