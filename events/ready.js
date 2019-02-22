const config = require("../config.json");
const Logger = require("../core/Logger.js");
module.exports = client => {
    Logger.success("Discord", `Ready, Logged in as ${client.user.username}`);
        client.user.setStatus(config.status);
        client.user.setPresence({
            game: {
                name: config.gamename,
                type: config.gametype,
                url: config.gameurl
            }
        });
};
