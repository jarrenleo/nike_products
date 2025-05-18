export const getNikeProductData = async (sku, country, language) => {
  const channels = ["SNKRS Web", "Nike.com", "SNKRS"];
  if (country === "AU") country = "ASTLA";

  for (const channel of channels) {
    const response = await fetch(
      `https://api.nike.com/product_feed/threads/v3/?filter=marketplace(${country})&filter=language(${language})&filter=channelName(${channel})&filter=productInfo.merchProduct.styleColor(${sku})&filter=exclusiveAccess(true,false)`
    );
    const data = await response.json();
    const product = data.objects?.at(0);

    if (!product) continue;

    return product;
  }

  return null;
};

export const getNikeCalendarData = async (url, calendarData = []) => {
  const response = await fetch(url);
  const data = await response.json();

  calendarData.push(...data.objects);

  if (data.pages.next)
    return await getNikeCalendarData(
      `https://api.nike.com${data.pages.next}`,
      calendarData
    );

  return calendarData;
};
