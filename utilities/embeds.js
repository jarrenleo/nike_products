export const productEmbed = (data) => {
  const [
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
  ] = data;

  return [
    {
      color: 0x868e96,
      title: name,
      url: url,
      thumbnail: {
        url: image,
      },
      fields: [
        {
          name: "Status",
          value: status,
          inline: true,
        },
        {
          name: "Method",
          value: method,
          inline: true,
        },
        {
          name: "Cart Limit",
          value: cartLimit,
          inline: true,
        },
        {
          name: "Style Colour",
          value: sku,
          inline: true,
        },
        {
          name: "Country",
          value: country,
          inline: true,
        },
        {
          name: "Price",
          value: price,
          inline: true,
        },
        {
          name: "Colourway",
          value: colourway,
          inline: true,
        },
        {
          name: "Launch Date & Time",
          value: `<t:${launchDateAndTime}:F> | <t:${launchDateAndTime}:R>`,
          inline: false,
        },
        ...sizesAndStockLevels,
        {
          name: "Links",
          value: links,
          inline: false,
        },
      ],
      footer: {
        text: promotion,
      },
      timestamp: new Date(Date.now()).toISOString(),
    },
  ];
};

export const calendarEmbed = (data) => {
  const [country, embedFields] = data;

  return [
    {
      color: 0x868e96,
      title: "Nike Webstore Calendar",
      fields: [
        {
          name: "Country",
          value: country,
        },
        ...embedFields,
      ],
    },
  ];
};
