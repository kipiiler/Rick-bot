const redisClient = require("../redis");

module.exports = {
  name: "startchat",
  description: "this is a startchat command",
  async execute(message, args) {
    if (!args[1] || args[2]) {
      return;
    }
    const value = await redisClient.getAsync(args[1]);
    if (value) {
      redisClient.DELAsync(args[1]);
      message.reply(`Delete Property : ${args[1]}`);
    } else {
      message.reply(`Can't find property with key ${args[1]}`);
    }
  },
};
