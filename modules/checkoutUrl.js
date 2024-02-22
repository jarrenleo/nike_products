import { CheckoutUrlData } from "../data/checkoutUrlData.js";
import { checkoutUrlEmbed } from "../utilities/embeds.js";

export class CheckoutUrl extends CheckoutUrlData {
  constructor() {
    super();
  }

  async createEmbed(sku, country, size) {
    try {
      const data = await this.getCheckoutUrlData(sku, country, size);
      return checkoutUrlEmbed(data);
    } catch (e) {
      throw Error(e.message);
    }
  }

  async sendEmbed(m, embed) {
    try {
      const userDM = await m.author.createDM();
      await userDM.send({
        embeds: embed,
      });
    } catch (e) {
      this.sendError(m, e.message);
    }
  }

  sendError(m, message) {
    console.log(message);
    m.reply({
      content: message,
    });
  }

  async handleMessage(m, sku, country, size) {
    try {
      if (!sku) throw new Error("Missing SKU parameter");
      if (!country) throw new Error("Missing country parameter");
      if (!size) throw new Error("Missing size parameter");

      const embed = await this.createEmbed(
        sku.toUpperCase(),
        country.toUpperCase(),
        size.toUpperCase()
      );
      await this.sendEmbed(m, embed);
    } catch (e) {
      this.sendError(m, e.message);
    }
  }
}
