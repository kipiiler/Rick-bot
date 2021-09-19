const redisClient = require("../redis");

module.exports = {
  name: "endchat",
  description: "this is a endchat command",
  execute(message, args) {
    redisClient.delAsync("isStarted").then(message.channel.send("Chat ended"));
    redisClient.delAsync("past_user_inputs").catch((err) => {
      if (err) message.channel.send(err);
    });
  },
};
