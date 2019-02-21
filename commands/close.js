const config = require('../config.json')

exports.run = (client, message) => {
  if (message.channel.type === 'dm') {
    return message.author.send('You don\'t have permission for this command')
  } else {
    message.channel.delete()
    client.channels.get(config.logchannelid).send({
      embed: {
        color: 3447003,
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        fields: [{
          name: `Ticket Closed`,
          value: `ID: ${message.channel.id}`
        },
        ],
        timestamp: new Date(),
        footer: {
          text: `Closed`
        }
      }
    })
    let id = message.channel.name
    client.users.get(id).send(`**Your ticket has been closed.** If you need additional help, please message me again.`)
  }
};



exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["c"]
};

exports.help = {
  name: "close",
  description: "Close the ticket",
  usage: "close"
};