import { getNikeProductData } from "./nikeAPI.js";
import { getGoatData } from "./goatAPI.js";
import { getNovelshipData } from "./novelshipAPI.js";
import { getLanguage } from "../utilities/helpers.js";

export class ProductData {
  getProductInfo(product, sku) {
    return product.length === 1
      ? product[0]
      : product.find((product) => product.merchProduct.styleColor === sku);
  }

  getURL(channel, sku, country, slug) {
    const countryPath = country !== "US" ? `/${country.toLowerCase()}` : "";

    switch (channel) {
      case "SNKRS Web":
        return `https://www.nike.com${countryPath}/launch/t/${slug}`;
      case "Nike.com":
        return `https://www.nike.com${countryPath}/t/${slug}/${sku}`;
    }
  }

  getImage(sku) {
    return `https://secure-images.nike.com/is/image/DotCom/${sku.replace(
      "-",
      "_"
    )}`;
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
    const splitCount = Math.ceil(skus.length / 2);

    for (let i = 0; i < skus.length; ++i) {
      for (let j = 0; j < gtins.length; ++j) {
        if (skus[i].gtin === gtins[j].gtin) {
          const level = gtins[j].level;
          sizesAndStockLevels.push(
            `${metric}${skus[i].nikeSize} (${level}) ${this.getIndicator(
              level
            )}`
          );
          break;
        }

        if (j === gtins.length - 1)
          sizesAndStockLevels.push(`${metric}${skus[i].nikeSize} (OOS) 🔴`);
      }
    }

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

  getLinks(sku, goatData, novelshipData) {
    const goatResultsData = goatData.results[0]?.data;
    const goatUrl =
      goatData.total_num_results &&
      goatResultsData.sku.replace(" ", "-") === sku
        ? `https://www.goat.com/${goatResultsData.product_type}/${goatResultsData.slug}`
        : `https://www.goat.com/search?query=${sku}`;

    const novelshipUrl =
      novelshipData?.sku === sku
        ? `https://novelship.com/${novelshipData.name_slug}`
        : `https://novelship.com/browse?q=${sku}`;

    return `[Goat](${goatUrl}) | [Novelship](${novelshipUrl}) | [SNKRDunk](https://snkrdunk.com/en/sneakers/${sku})`;
  }

  getPromotion(promoData) {
    const hasPromotion = promoData.length ? "excluded from" : "included in";
    return `Product is ${hasPromotion} site promotions`;
  }

  async getProductData(sku, country) {
    try {
      const language = getLanguage(country);
      if (!language) throw Error(`Country **${country}** is not supported`);

      const [snkrsData, nikecomData, goatData, novelshipData] =
        await Promise.all([
          getNikeProductData("SNKRS%20Web", sku, country, language),
          getNikeProductData("Nike.com", sku, country, language),
          getGoatData(sku),
          getNovelshipData(sku),
        ]);

      const data = nikecomData ?? snkrsData;
      if (!data) throw Error(`Product **${sku}** not found in **${country}**`);

      const productInfo = this.getProductInfo(data.productInfo, sku);
      const name = productInfo.productContent.fullTitle;
      const url = this.getURL(
        data.channelName,
        sku,
        country,
        productInfo.productContent.slug
      );
      const image = this.getImage(sku);
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
      const links = this.getLinks(sku, goatData, novelshipData);
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
