const {SlashCommand} = require('slash-create');

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'hello',
            description: 'Says hello to you.',
            guildIDs: ['808403061735292968']
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        return `Hello, ${ctx.user.username}`;
    }
};
