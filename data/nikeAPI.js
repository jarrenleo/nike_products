import fetch from "node-fetch";

export const getNikeProductData = async (channel, sku, country, language) => {
  const response = await fetch(
    `https://api.nike.com/product_feed/threads/v3/?filter=marketplace(${country})&filter=language(${language})&filter=channelName(${channel})&filter=productInfo.merchProduct.styleColor(${sku})&filter=exclusiveAccess(true,false)`
  );
  const data = await response.json();

  return data.objects?.at(0);
};

export const getNikeCalendarData = async (url, calendarData = []) => {
  const response = await fetch(url);
  const data = await response.json();

  calendarData.push(...data.objects);

  if (data.pages.next)
    return await getNikeCalendarData(`https://api.nike.com${data.pages.next}`);

  return calendarData;
};
