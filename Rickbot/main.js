const Discord = require("discord.js");
const axios = require("axios");
const bluebird = require("bluebird");
const redis = require("redis");
const fs = require("fs");
require("dotenv").config();
const redisClient = require("./redis");

bluebird.promisifyAll(redis);

const API_URL = "https://api-inference.huggingface.co/models/kipiiler/Rickbot";
const client = new Discord.Client();
const prefix = "Rick ";

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
  console.log("Bot ready");
});

client.on("message", async (message) => {
  if (!message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) {
    return;
  }

  const value = await redisClient.getAsync("isStarted");
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args[0].toLocaleLowerCase();

    if (command == "startchat") {
      await client.commands.get("startchat").execute(message, args);
    }

    if (command == "endchat") {
      await client.commands.get("endchat").execute(message, args);
    }

    if (command == "ping") {
      await client.commands.get("ping").execute(message, args);
    }

    if (command == "get") {
      await client.commands.get("get").execute(message, args);
    }

    if (command == "set") {
      await client.commands.get("set").execute(message, args);
    }

    if (command == "del") {
      await client.commands.get("del").execute(message, args);
    }

    if (command == "dropdb") {
      await client.commands.get("dropdb").execute(message, args);
    }

    if (command == "expire") {
      await client.commands.get("expire").execute(message, args);
    }

    if (command == "getchat") {
      await client.commands.get("getchat").execute(message, args);
    }
  }

  if (!message.content.startsWith(prefix)) {
    if (!value) {
      return;
    } else {
      const past_user_inputs = await redisClient.lrangeAsync(
        "past_user_inputs",
        0,
        -1
      );

      const authHeaders = {
        Authorization: "Bearer " + process.env.HUGGINGFACE_TOKEN,
      };

      message.channel.startTyping();
      const response = await axios.post(
        API_URL,
        {
          inputs: {
            text: message.content,
            past_user_inputs: past_user_inputs.length ? past_user_inputs : [],
          },
        },
        { headers: authHeaders }
      );

      if (response.isAxiosError) {
        message.channel.send("Something went wrong");
        message.channel.stopTyping();
      }
      message.channel.stopTyping();
      if (response.data.error && response.data.error.length > 0) {
        message.reply(response.data.error);
      }
      if (response.data.error && response.data.error.length > 0) {
        message.reply(response.data.error);
      }
      message.reply(response.data.generated_text);

      if (!past_user_inputs.length) {
        redisClient.rpushAsync("past_user_inputs", message.content);
        redisClient.expireAsync("past_user_inputs", 30);
        console.log("set expire");
      } else {
        redisClient.rpushAsync("past_user_inputs", message.content);
      }
    }
  }
});
