require("dotenv").config();

const Discord = require("discord.js");
const discord_client = new Discord.Client();
discord_client.login(process.env.DISCORD_TOKEN);

discord_client.once("ready", () => {
  console.info(`Logged in as ${discord_client.user.tag}!`);
  liveQuery();
  liveQueryPRO();
});

const Moralis = require("moralis/node");
Moralis.initialize(process.env.MORALIS_APPLICATION_ID);
Moralis.serverURL = process.env.MORALIS_SERVER_URL;

async function liveQuery() {
  console.log("Starting the live query");
  let query = new Moralis.Query("PolyNewDeposit");
  let subscription = await query.subscribe();

  subscription.on("open", () => {
    console.log("subscription opened");
  });

  subscription.on("create", (object) => {
    if (object) {
      if (object.attributes.amount) {
        let amount = object.attributes.amount.toString();
        amount = amount.substring(0, amount.length - 18);
        console.log(`New deposit of: ${amount}`);
        discord_client.channels.cache
          .get(process.env.DISCORD_CHANNEL)
          .send(
            `New ${amount} MATIC deposit to PolySec contract: ${process.env.CONTRACT_ADDRESS}`
          );
      }
    }
  });

  subscription.on("close", () => {
    console.log("subscription closed");
  });
}

async function liveQueryPRO() {
  console.log("Starting the PRO live query");
  let pro_query = new Moralis.Query("PROPolyNewDeposit");
  let pro_subscription = await pro_query.subscribe();

  pro_subscription.on("open", () => {
    console.log("PRO subscription opened");
  });

  pro_subscription.on("create", (object) => {
    if (object) {
      if (object.attributes.amount) {
        let amount = object.attributes.amount.toString();
        amount = amount.substring(0, amount.length - 18);
        console.log(`New deposit of: ${amount}`);
        discord_client.channels.cache
          .get(process.env.DISCORD_CHANNEL_PRO)
          .send(
            `New ${amount} MATIC deposit to PolySecPro contract: ${process.env.CONTRACT_ADDRESS_PRO}`
          );
      }
    }
  });

  pro_subscription.on("close", () => {
    console.log("PRO subscription closed");
  });
}
