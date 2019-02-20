const chalk = require('chalk');
module.exports = client => {
    console.log(chalk.bgBlue('I\'m online.'));
        client.user.setStatus(config.status)
        client.user.setPresence({
            game: {
                name: config.gamename,
                type: config.gametype,
                url: config.gameurl
            }
        })
};