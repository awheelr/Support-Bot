const config = require("../config.json");
exports.run = (client, message) => {
    let args = message.content.split(" ").slice(1);
    if (message.author.id === config.ownerid) {
        if (message.delete) {
            message.channel.send(args.join(" "));
        }
    } else {
        message.channel.send("You don't have permission for that command");
    }
    if (message.content.startsWith(`${config.prefix}say`)) return message.delete().catch(console.error);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["s"]
};

exports.help = {
    name: "say",
    description: "Makes the bot repeat your message.",
    usage: "say [message]"
};

