const config = require("../config.json");
exports.run = (client, message) => {
  var name = message.author.username;
  let args = message.content.split(/ +/g).slice(1);
  if (args.length < 2) return message.channel.send("Incorrect command usage!");
  let id = args[0];
  let text = args.slice(1).join(" ");

  if (message.channel.type === "dm") {
    return message.author.send("You don't have permission for this command");
  } else {
    let support_role = message.guild.roles.get(`${config.supportid}`);
    if (support_role && message.member.roles.has(support_role.id)) {
      if (client.users.get(id).send(`**${name}**: ${text}`)) {
        return message.channel.send({
          embed: {
            color: 3447003,
            author: {
              name: message.author.username,
              icon_url: message.author.avatarURL
            },
            fields: [{
              name: `Your message has been sent!`,
              value: `${name}: ${text}`
            }],
            timestamp: new Date(),
            footer: {
              text: "Reply"
            }
          }
        });
      }
    } else {
      return message.channel.send("You don't have permission for that command");
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["r"]
};

exports.help = {
  name: "reply",
  description: "Reply to ticket",
  usage: "reply"
};
