export function getProductInfo(product, sku) {
  return product.length === 1
    ? product[0]
    : product.find((product) => product.merchProduct.styleColor === sku);
}

export function getName(country, sku, publishedContent) {
  let publishedName;
  const title = publishedContent.properties.coverCard.title;
  const subtitle = publishedContent.properties.coverCard.subtitle;

  if (title && subtitle) {
    publishedName = `${subtitle} '${title}'`;
  } else {
    const seoTitle = publishedContent.properties.seo.title;
    if (!seoTitle.includes(`(${sku})`)) return;

    let startIndex = 0;
    if (country === "FR") startIndex = 21;

    let indexToDeduct = 2;
    if (country === "KR") indexToDeduct = 1;

    const endIndex = seoTitle.indexOf(sku) - indexToDeduct;

    publishedName = seoTitle.slice(startIndex, endIndex);
  }

  return publishedName;
}

export function getImage(nodes, sku) {
  const imageNode = nodes.find((node) =>
    node.properties.internalName?.includes(sku)
  );
  if (!imageNode) return nodes[0].nodes[0].properties.squarishURL;

  return imageNode.properties.squarishURL;
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
