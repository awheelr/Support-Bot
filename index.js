const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');
require('./util/eventLoader')(client);

const log = (msg) => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${msg}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
    if (err) console.error(err);
    log(`Loading a total of ${files.length} commands.`);
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        log(`Loading command: "${props.help.name}"...`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name)
        });
    });
});

client.reload = function (command) {
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
        } catch (e) {
            reject(e);
        }
    });
};

client.on("message", async message => {
    var guild = client.guilds.get(config.guildid)
    var userid = message.author.id;

    if (message.channel.type === 'dm') {
        if (message.content.startsWith(config.prefix)) {
            return null
        }
        if (message.author.id === '328077146880999425') {
            return null
        }

        let channel = (guild.channels.find(channel => channel.name === userid))
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
                    },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Ticket"
                    }
                }
            })
        } else {

            guild.createChannel(userid)
                .then(channel => channel.setParent(config.categorytickets))
                .then(channel => channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                        },
                        fields: [{
                            name: `${message.author.id}`,
                            value: `${message.content}`
                        },
                        ],
                        timestamp: new Date(),
                        footer: {
                            text: "Ticket"
                        }
                    }
                }))
            message.author.send(`**Message sent!** Your ticket has been created!`)
        }
    };
});

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('debug', e => {
    console.log(chalk.bgBlue(e.replace(regToken, 'that was redacted')));
});

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(config.token);