const redisClient = require("../redis");

module.exports = {
  name: "getchat",
  description: "this is a get chat history command",
  async execute(message, args) {
    const results = await redisClient.lrangeAsync("past_user_inputs", 0, -1);
    if (!results.length) {
      message.channel.send("no history");
    }
    results.forEach((el) => {
      message.reply(el);
    });
  },
};
