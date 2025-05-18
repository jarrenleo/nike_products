import { config } from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { Product } from "./modules/product.js";
// import { Calendar } from "./modules/calendar.js";
import { CheckoutUrl } from "./modules/checkoutUrl.js";
config();

class Discord {
  product = new Product();
  // calendar = new Calendar();
  checkoutUrl = new CheckoutUrl();

  constructor() {
    this.discord = this.initDiscord();
    this.handleMessage();
  }

  initDiscord() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });
    client.login(process.env.DISCORD_TOKEN);

    return client;
  }

  getParams(content) {
    const skus = [];
    const countries = [];

    const params = content.split(" ");
    for (const param of params) {
      if (!param) continue;

      param.length === 2
        ? countries.push(param.toUpperCase())
        : skus.push(param.toUpperCase());
    }

    return [skus, countries];
  }

  checkTSBRoles(m) {
    const authorisedRoles = [
      "POOP-ADMINS",
      "DEV",
      "POOP-MODS",
      "POOP-PR",
      "POOP-MARKETING",
      "POOP-F&F",
      "POOP-SUPERIORS",
      "POOP-ELITES",
      "POOP-PLUGS",
    ];

    return m.member?.roles.cache.some((role) =>
      authorisedRoles.includes(role.name)
    );
  }

  handleMessage() {
    this.discord.on(Events.MessageCreate, async (m) => {
      if (m.guildId === "555044271925887016") {
        const hasAuthorisedRole = this.checkTSBRoles(m);
        if (!hasAuthorisedRole) return;
      }

      if (m.content.startsWith("!nike")) {
        const [skus, countries] = this.getParams(
          m.content.slice(5).trimStart()
        );

        await this.product.handleMessage(m, skus, countries);
      }

      // if (m.content.startsWith("!calendar")) {
      //   const [_, countries] = this.getParams(m.content.slice(9).trimStart());

      //   await this.calendar.handleMessage(m, countries);
      // }

      if (m.content.startsWith("!checkout")) {
        const [sku, country, sizes] = m.content.slice(9).trimStart().split(" ");
        await this.checkoutUrl.handleMessage(m, sku, country, sizes);
      }
    });
  }
}

new Discord();
