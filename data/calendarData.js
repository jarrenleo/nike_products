import { getNikeCalendarData } from "./nikeAPI.js";
import { getLanguage } from "../utilities/helpers.js";

export class CalendarData {
  includeKeywords = [
    "Dunk Low",
    "Jordan 1 Retro",
    "Jordan 1 Mid",
    "Jordan 1 Low",
    "Jordan 4",
    "ダンク LOW",
    "ジョーダン 1 レトロ",
    "ジョーダン 1 MID",
    "ジョーダン 1 LOW",
    "ジョーダン 4",
  ];
  excludeKeywords = [
    "Younger",
    "Little",
    "Toddler",
    "Craft",
    "Disrupt",
    "CMFT",
  ];

  getUpcomingIndex(calendarData) {
    return calendarData.findIndex(
      (data) =>
        Date.parse(data.productInfo[0].merchProduct.commerceStartDate) >
        Date.now()
    );
  }

  filterProducts(title) {
    for (const keyword of this.excludeKeywords)
      if (title.includes(keyword)) return false;

    for (const keyword of this.includeKeywords)
      if (title.includes(keyword)) return true;

    return false;
  }

  sortProducts(upcomingIndex, calendarData) {
    let upcomingProducts = {};

    for (let i = upcomingIndex; i < calendarData.length; ++i) {
      const product = calendarData[i]?.productInfo[0];
      if (!product) continue;
      if (!this.filterProducts(product.productContent.fullTitle)) continue;

      const launchDateAndTime =
        product.launchView?.startEntryDate ??
        product.merchProduct.commerceStartDate;
      const key = Date.parse(launchDateAndTime) / 1000;
      const value = {
        name: product.productContent.title,
        styleColour: product.merchProduct.styleColor,
      };

      !upcomingProducts[key]
        ? (upcomingProducts[key] = [value])
        : upcomingProducts[key].push(value);
    }

    const t = upcomingProducts;
    upcomingProducts = {};

    return t;
  }

  generateEmbedFields(upcomingProducts) {
    let embedFields = [];

    for (const [key, values] of Object.entries(upcomingProducts)) {
      let products = "";

      for (const value of values) {
        products += `${value.name}\n${value.styleColour}\n\n`;
      }

      embedFields.push(
        ...[
          {
            name: "Launch Date & Time",
            value: `<t:${key}:F> | <t:${key}:R>`,
          },
          {
            name: "Product(s)",
            value: "```" + products + "```",
          },
        ]
      );
    }

    const t = embedFields;
    embedFields = [];

    return t;
  }

  async getCalendarData(country) {
    try {
      const language = getLanguage(country);
      if (!language) throw Error(`Country **${country}** is not supported`);

      const calendarData = await getNikeCalendarData(
        `https://api.nike.com/product_feed/threads/v3/?count=100&filter=marketplace(${country})&filter=language(${language})&filter=upcoming(true)&filter=channelName(Nike.com)&filter=productInfo.merchProduct.status(ACTIVE)&filter=exclusiveAccess(true,false)&sort=productInfo.merchProduct.commerceStartDateAsc`
      );

      const upcomingIndex = this.getUpcomingIndex(calendarData);
      const upcomingProducts = this.sortProducts(upcomingIndex, calendarData);

      if (!Object.keys(upcomingProducts).length)
        throw Error(`No notable upcoming releases found in **${country}**`);

      const embedFields = this.generateEmbedFields(upcomingProducts);

      if (embedFields.length > 24) return [country, embedFields.slice(0, 24)];

      return [country, embedFields];
    } catch (e) {
      throw Error(e.message);
    }
  }
}
