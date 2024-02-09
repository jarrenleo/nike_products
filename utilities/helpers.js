export function getProductInfo(product, sku) {
  return product.length === 1
    ? product[0]
    : product.find((product) => product.merchProduct.styleColor === sku);
}

export function getName(channel, country, sku, publishedContent) {
  if (channel !== "SNKRS Web") return;

  const title = publishedContent.properties.seo.title;

  if (title.includes(sku)) {
    let startSliceIndex = 0;
    if (country === "JP" && title.includes("NIKE公式")) startSliceIndex = 8;

    const endSliceIndex = title.indexOf(sku) - 2;

    return title.slice(startSliceIndex, endSliceIndex);
  }

  const numOfProducts = publishedContent.properties.products.length;

  if (numOfProducts === 1) {
    const altText = publishedContent.nodes.at(-1).properties.altText;
    if (!altText) return;

    const endSliceIndex = altText.toLowerCase().indexOf("release") - 1;

    return altText.slice(0, endSliceIndex);
  }

  const numOfNodes = publishedContent.nodes.length;

  for (let i = numOfNodes - 1; i >= numOfNodes - numOfProducts; --i) {
    const properties = publishedContent.nodes[i].properties;
    if (!properties.internalName) continue;

    if (properties.internalName.includes(sku))
      return `${properties.subtitle} '${properties.title}'`;
  }
}

export function getImage(sku) {
  return `https://secure-images.nike.com/is/image/DotCom/${sku.replace(
    "-",
    "_"
  )}`;
}

export const getLanguage = (marketplace) => {
  const marketplaceMap = {
    PT: "en-GB",
    GB: "en-GB",
    ZA: "en-GB",
    CZ: "en-GB",
    PH: "en-GB",
    SK: "en-GB",
    SI: "en-GB",
    SG: "en-GB",
    SE: "en-GB",
    CH: "en-GB",
    SA: "en-GB",
    LU: "en-GB",
    FI: "en-GB",
    IN: "en-GB",
    IL: "en-GB",
    CA: "en-GB",
    IE: "en-GB",
    ID: "en-GB",
    RO: "en-GB",
    HR: "en-GB",
    BG: "en-GB",
    NZ: "en-GB",
    BE: "en-GB",
    NO: "en-GB",
    NL: "en-GB",
    AU: "en-GB",
    AT: "en-GB",
    MY: "en-GB",
    DK: "en-GB",
    AE: "en-GB",
    PL: "pl",
    FR: "fr",
    IT: "it",
    US: "en",
    JP: "ja",
    ES: "es-ES",
    HU: "hu",
    KR: "ko",
    TW: "zh-Hant",
    TR: "tr",
    TH: "th",
    GR: "el",
    MX: "es-419",
    DE: "de",
  };

  return marketplaceMap[marketplace];
};
