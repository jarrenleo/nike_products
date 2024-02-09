import { ProductData } from "../data/productData.js";
import { productEmbed } from "../utilities/embeds.js";

export class Product extends ProductData {
  constructor() {
    super();
  }

  async createEmbed(sku, country) {
    try {
      const data = await this.getProductData(sku, country);
      return productEmbed(data);
    } catch (e) {
      throw Error(e.message);
    }
  }

  async sendEmbed(m, embed) {
    try {
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

  sendError(m, message) {
    m.reply({
      content: message,
    });
  }

  async handleMessage(m, skus, countries) {
    try {
      if (!skus.length) throw new Error("Missing SKU parameter");
      if (!countries.length) throw new Error("Missing country parameter");

      for (const sku of skus) {
        for (const country of countries) {
          const embed = await this.createEmbed(sku, country);
          await this.sendEmbed(m, embed);
        }
      }
    } catch (e) {
      this.sendError(m, e.message);
    }
  }
}
