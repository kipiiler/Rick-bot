const redisClient = require("../redis");

module.exports = {
  name: "expire",
  description: "this is a expire command",
  execute(message, args) {
    if (!args[1] && !args[2]) {
      return;
    }
    redisClient
      .expireAsync(args[1], args[2])
      .then((reply) => message.reply(reply));
  },
};
