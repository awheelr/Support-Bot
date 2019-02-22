const config = require("../config.json");
exports.run = (client, message, args) => {
    let messagecount = parseInt(args.join(" "));
    if (message.channel.type === "dm") {
        return message.author.send("You don't have permission for this command");
    } else {
        let support_role = message.guild.roles.get(`${config.supportid}`);
        if (support_role && message.member.roles.has(support_role.id)) {
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messages));

            message.channel.send("Messages purged.")
                .then(msg => {
                    msg.delete();
                });

            if (message.content.startsWith(config.prefix, "purge")) message.delete();
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
};

exports.help = {
    name: "purge",
    description: "Bulk-deletes X amount of messages. Minimum = 2 messages.",
    usage: "purge <number>"
};
