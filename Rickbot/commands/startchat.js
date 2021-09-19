const redisClient = require("../redis");

module.exports = {
  name: "startchat",
  description: "this is a startchat command",
  execute(message, args) {
    message.channel.send("Chat mode initiate");
    redisClient
      .setAsync("isStarted", "true")
      .then(message.reply("Now you can chat with Rick"));
  },
};
