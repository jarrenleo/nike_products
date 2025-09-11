import { randomUUID } from "crypto";
import { getLanguage, getProductInfo, getName } from "../utilities/helpers.js";
import { getNikeProductData } from "./nikeAPI.js";

export class CheckoutUrlData {
  async getCheckoutUrlData(sku, country, size) {
    try {
      const language = getLanguage(country);
      if (!language) throw new Error(`Country **${country}** is not supported`);

      const data = await getNikeProductData(sku, country, language);
      if (!data)
        throw new Error(`Product **${sku}** not found in **${country}**`);
      if (data.channelName !== "SNKRS Web")
        throw new Error("Cannot generate checkout url for Non-SNKRS product");

      const productInfo = getProductInfo(data.productInfo, sku);

      const launchId = productInfo.launchView?.id;
      if (!launchId)
        throw new Error(`Product **${sku}** is not an upcoming launch product`);

      const skuId = productInfo.skus.find((sku) => sku.nikeSize === size)?.id;
      if (!skuId)
        throw new Error(`Size **${size}** not found in **${country}**`);

      let name = productInfo.productContent.fullTitle;
      if (data.channelName === "SNKRS Web")
        name =
          getName(country, sku, data.publishedContent) ||
          productInfo.productContent.fullTitle;
      const image =
        data.publishedContent.nodes[0].nodes[0].properties.squarishURL;
      const checkoutId = randomUUID();
      const slug = data.publishedContent.properties.seo.slug;
      const url = `[Click Me](https://gs.nike.com/?checkoutId=${checkoutId}&launchId=${launchId}&skuId=${skuId}&country=${country}&locale=${language}&appId=com.nike.commerce.snkrs.web&returnUrl=https://www.nike.com/${country.toLowerCase()}/launch/t/${slug}/)`;

      return {
        name,
        image,
        country,
        size,
        url,
      };
    } catch (e) {
      throw Error(e.message);
    }
  }
}
