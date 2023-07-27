import fetch from "node-fetch";

export const getNovelshipData = async (sku) => {
  const response = await fetch(
    "https://n8ibe2vbxj-dsn.algolia.net/1/indexes/prod_products/query?x-algolia-agent=Algolia for JavaScript (4.10.3); Browser (lite)&x-algolia-api-key=a6d4df9f20747fe6ac25247993a4ac8c&x-algolia-application-id=N8IBE2VBXJ",
    {
      method: "POST",
      body: JSON.stringify({ query: `${sku}`, hitsPerPage: "1" }),
    }
  );
  const data = await response.json();

  return data.hits[0];
};
