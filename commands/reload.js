const config = require('../config.json')
exports.run = (client, message, args) => {
    let command;
    if (message.channel.type === 'dm') {
        return message.author.send('You don\'t have permission for this command')
    } else {
        let support_role = message.guild.roles.get(`${config.supportid}`);;
        if (support_role && message.member.roles.has(support_role.id)) {
            if (client.commands.has(args[0])) {
                command = args[0];
            } else if (client.aliases.has(args[0])) {
                command = client.aliases.get(args[0]);
            }
            if (!command) {
                return message.channel.send(`I cannot find the command: "${args[0]}".`);
            } else {
                message.channel.send(`Reloading ${command}...`)
                    .then(m => {
                        client.reload(command)
                            .then(() => {
                                m.edit(`Successfully reloaded "${command}".`);
                            })
                            .catch(e => {
                                m.edit(`Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
                            });
                    });
            }
        } else {
            message.channel.send('You don\'t have permission to use this command.')
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [""],
};

exports.help = {
    name: "reload",
    description: "Reloads the command file if it has been updated or modified.",
    usage: "reload [command-name]"
};