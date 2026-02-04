import { config } from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { Product } from "./modules/product.js";
import { CheckoutUrl } from "./modules/checkoutUrl.js";
config();

class Discord {
  product = new Product();
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

  handleMessage() {
    this.discord.on(Events.MessageCreate, async (m) => {
      if (m.content.startsWith("!nike")) {
        const [skus, countries] = this.getParams(
          m.content.slice(5).trimStart()
        );

        await this.product.handleMessage(m, skus, countries);
      }

      if (m.content.startsWith("!checkout")) {
        const [sku, country, sizes] = m.content.slice(9).trimStart().split(" ");
        await this.checkoutUrl.handleMessage(m, sku, country, sizes);
      }
    });
  }
}

new Discord();
