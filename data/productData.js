import { getNikeProductData } from "./nikeAPI.js";
import { getLanguage, getProductInfo, getName } from "../utilities/helpers.js";

export class ProductData {
  getURL(channel, sku, country, slug) {
    const countryPath = country !== "US" ? `/${country.toLowerCase()}` : "";

    switch (channel) {
      case "SNKRS Web" || "SNKRS":
        return `https://www.nike.com${countryPath}/launch/t/${slug}`;
      case "Nike.com":
        return `https://www.nike.com${countryPath}/t/${slug}/${sku}`;
    }
  }

  getIndicator(indicator) {
    const indicatorMap = {
      ACTIVE: "🟢",
      HIGH: "🟢",
      HOLD: "🟡",
      MEDIUM: "🟡",
      LOW: "🟠",
      INACTIVE: "🔴",
      OOS: "🔴",
      CLOSEOUT: "❌",
      CANCEL: "❌",
    };

    return indicatorMap[indicator];
  }

  getStatus(status) {
    return `${status} ${this.getIndicator(status)}`;
  }

  getMethod(product) {
    const method =
      product.launchView?.method ?? product.merchProduct.publishType ?? "-";

    if (method === "DAN") {
      const duration =
        (Date.parse(product.launchView.stopEntryDate) -
          Date.parse(product.launchView.startEntryDate)) /
        (60 * 1000);

      return `${method} (${duration} minutes)`;
    }

    return method;
  }

  getPrice(price) {
    if (price.discounted)
      return `${price.currency} ${price.currentPrice.toLocaleString(
        "en-US"
      )} ~~${price.fullPrice.toLocaleString("en-US")}~~`;

    return `${price.currency} ${price.fullPrice.toLocaleString("en-US")}`;
  }

  getSizesAndStockLevels(type, skus, gtins) {
    if (!skus || !gtins)
      return [
        {
          name: "Sizes & Stock Levels",
          value: "-",
          inline: true,
        },
      ];

    const sizesAndStockLevels = [];
    const metric = type === "FOOTWEAR" ? "US" : "";
    const gtinMap = new Map();

    for (const gtin of gtins) {
      gtinMap.set(gtin.gtin, gtin);
    }

    for (const sku of skus) {
      const matchedGtin = gtinMap.get(sku.gtin);

      matchedGtin
        ? sizesAndStockLevels.push(
            `${metric}${sku.nikeSize} (${
              matchedGtin.level
            }) ${this.getIndicator(matchedGtin.level)}`
          )
        : sizesAndStockLevels.push(`${metric}${sku.nikeSize} (OOS) 🔴`);
    }

    const splitCount = Math.ceil(skus.length / 2);

    return [
      {
        name: "Sizes & Stock Levels",
        value: sizesAndStockLevels.slice(0, splitCount).join("\n"),
        inline: true,
      },
      {
        name: "\u200b",
        value: sizesAndStockLevels.slice(splitCount).join("\n"),
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
    ];
  }

  getLinks(sku, productType) {
    const goatUrl = `https://www.goat.com/search?query=${sku}`;
    const snkrdunkUrl =
      productType === "FOOTWEAR"
        ? `https://snkrdunk.com/products/${sku}`
        : `https://snkrdunk.com/search/article/?keywords=${sku}`;

    const kreamUrl = `https://kream.co.kr/search?keyword=${sku}`;

    return `[Goat](${goatUrl}) | [SNKRDunk](${snkrdunkUrl}) | [Kream](${kreamUrl})`;
  }

  getPromotion(promoData) {
    const hasPromotion = promoData.length ? "excluded from" : "included in";
    return `Product is ${hasPromotion} site promotions`;
  }

  async getProductData(sku, country) {
    try {
      const language = getLanguage(country);
      if (!language) throw new Error(`Country **${country}** is not supported`);

      const data = await getNikeProductData(sku, country, language);
      if (!data)
        throw new Error(`Product **${sku}** not found in **${country}**`);

      const productInfo = getProductInfo(data.productInfo, sku);

      let name = productInfo.productContent.fullTitle;
      if (data.channelName === "SNKRS Web")
        name =
          getName(country, sku, data.publishedContent) ||
          productInfo.productContent.fullTitle;

      const url = this.getURL(
        data.channelName,
        sku,
        country,
        data.publishedContent.properties.seo.slug
      );
      const image =
        data.publishedContent.nodes[0].nodes[0].properties.squarishURL;
      const status = this.getStatus(productInfo.merchProduct.status);
      const method = this.getMethod(productInfo);
      const cartLimit = productInfo.merchProduct.quantityLimit;
      const price = this.getPrice(productInfo.merchPrice);
      const colourway = productInfo.productContent.colorDescription ?? "-";
      const launchDateAndTime =
        Date.parse(
          productInfo.launchView?.startEntryDate ??
            productInfo.merchProduct.commerceStartDate
        ) / 1000;
      const sizesAndStockLevels = this.getSizesAndStockLevels(
        productInfo.merchProduct.productType,
        productInfo.skus,
        productInfo.availableGtins
      );
      const links = this.getLinks(sku, productInfo.merchProduct.productType);
      const promotion = this.getPromotion(
        productInfo.merchPrice.promoExclusions
      );

      return [
        name,
        url,
        image,
        status,
        method,
        cartLimit,
        sku,
        country,
        price,
        colourway,
        launchDateAndTime,
        sizesAndStockLevels,
        links,
        promotion,
      ];
    } catch (e) {
      throw Error(e.message);
    }
  }
}
