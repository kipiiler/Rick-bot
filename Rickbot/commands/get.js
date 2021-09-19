const redisClient = require("../redis");

module.exports = {
  name: "get",
  description: "this is a get redis command",
  async execute(message, args) {
    if (!args[1] || args[2]) {
      return;
    }
    const value = await redisClient.getAsync(args[1]);
    if (value) {
      message.reply(`Reading property : ${args[1]} - ${value}`);
    } else {
      message.reply(`Can't find property with key ${args[1]}`);
    }
  },
};
