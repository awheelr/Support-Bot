const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const moment = require("moment");
const fs = require("fs");
require("./util/eventLoader")(client);


const log = msg => {
    console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${msg}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    log(`Loading a total of ${files.length} commands.`);
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        log(`Loading command: "${props.help.name}"...`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = (command) => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch(e) {
            reject(e);
        }
    });
};

client.on("message", async message => {
    var guild = client.guilds.get(config.guildid);
    var userid = message.author.id;

    if (message.channel.type === "dm") {
        if (message.content.startsWith(config.prefix)) {
            return null;
        }
        if (message.author.id === config.botid) {
            return null;
        }

        let channel = guild.channels.find(channel => channel.name === userid);
        if (channel) {
            channel.send({
                embed: {
                    color: 3447003,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL
                    },
                    fields: [{
                        name: `${message.author.id}`,
                        value: `${message.content}`
                    }],
                    timestamp: new Date(),
                    footer: {
                        text: "Ticket"
                    }
                }
            });
        } else {
            guild
                .createChannel(userid)
                .then(channel => channel.setParent(config.categorytickets))
                .then(channel =>
                    channel.send({
                        embed: {
                            color: 3447003,
                            author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                            },
                            fields: [{
                                name: `${message.author.id}`,
                                value: `${message.content}`
                            }],
                            timestamp: new Date(),
                            footer: {
                                text: "Ticket"
                            }
                        }
                    })
                )
                .then(m => {
                    m.channel.overwritePermissions(guild.defaultRole.id, {
                        VIEW_CHANNEL: false
                    });

                    m.channel.overwritePermissions(config.supportid, {
                        VIEW_CHANNEL: true
                    });
                });
            return message.author.send(`**Message sent!** Your ticket has been created!`);
        }
    }
});

client.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.error(`Could not report the following error to Sentry: ${error.message}`);
});

process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
});


client.login(config.token);
