import { config } from "dotenv";
import { Client, GatewayIntentBits, Events } from "discord.js";
import { Product } from "./modules/product.js";
import { Calendar } from "./modules/calendar.js";
config();

class Discord {
  product = new Product();
  calendar = new Calendar();

  constructor() {
    this.discord = this.initDiscord();
    this.handleMessage();
    this.handleButtonInteraction();
  }

  initDiscord() {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
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
      param.length > 2
        ? skus.push(param.toUpperCase())
        : countries.push(param.toUpperCase());
    }

    return [skus, countries];
  }

  handleMessage() {
    this.discord.on(Events.MessageCreate, async (m) => {
      if (!m.content.startsWith("!nike") || !m.content.startsWith("!calendar"))
        return;

      if (m.content.startsWith("!nike")) {
        const [skus, countries] = this.getParams(
          m.content.slice(5).trimStart()
        );

        await this.product.handleMessage(m, skus, countries);
      }

      if (m.content.startsWith("!calendar")) {
        const [_, countries] = this.getParams(m.content.slice(9).trimStart());

        await this.calendar.handleMessage(m, countries);
      }
    });
  }

  handleButtonInteraction() {
    this.discord.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isButton()) return;
      await interaction.deferUpdate();

      await this.product.handleInteraction(interaction);
    });
  }
}

new Discord();
