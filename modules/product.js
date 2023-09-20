import { ProductData } from "../data/productData.js";
import { productEmbed } from "../utilities/embeds.js";

export class Product extends ProductData {
  constructor() {
    super();
  }

  getSKUandCountry(fields) {
    const sku = fields[3].value;
    const country = fields[4].value;

    return [sku, country];
  }

  async createEmbed(sku, country) {
    try {
      const data = await this.getProductData(sku, country);
      return productEmbed(data);
    } catch (e) {
      throw Error(e.message);
    }
  }

  async sendEmbed(m, sku, country) {
    try {
      const embed = await this.createEmbed(sku, country);

      m.reply({
        embeds: embed,
        allowedMentions: {
          repliedUser: false,
        },
      });
    } catch (e) {
      this.sendError(m, e.message);
    }
  }

  async updateEmbed(interaction, sku, country) {
    try {
      const embed = await this.createEmbed(sku, country);

      interaction.editReply({
        embeds: embed,
      });
    } catch (e) {
      interaction.editReply({
        content: e.message,
      });
    }
  }

  sendError(m, message) {
    m.reply({
      content: message,
    });
  }

  async handleMessage(m, skus, countries) {
    try {
      if (!skus.length) throw Error("Missing SKU parameter");
      if (!countries.length) throw Error("Missing country parameter");

      for (const sku of skus) {
        for (const country of countries) {
          await this.sendEmbed(m, sku, country);
        }
      }
    } catch (e) {
      this.sendError(m, e.message);
    }
  }

  async handleInteraction(interaction) {
    const [sku, country] = this.getSKUandCountry(
      interaction.message.embeds[0].data.fields
    );
    await this.updateEmbed(interaction, sku, country);
  }
}
