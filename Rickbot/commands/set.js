const redisClient = require("../redis");

module.exports = {
  name: "set",
  description: "this is a set redis command",
  async execute(message, args) {
    if (!args[1] && !args[2]) {
      return;
    }
    const value = await redisClient.getAsync(args[1]);
    if (value) {
      message.reply(`Reading property : ${args[1]} - ${value}`);
    } else {
      redisClient.set(args[1], args[2]);
      message.reply(`Writing Property : ${args[1]}`);
    }
  },
};
