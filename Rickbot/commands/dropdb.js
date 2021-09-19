const redisClient = require("../redis");

module.exports = {
  name: "dropdb",
  description: "this is a flushall redis command",
  execute(message, args) {
    redisClient.flushallAsync().then((reply) => message.reply(reply));
  },
};
