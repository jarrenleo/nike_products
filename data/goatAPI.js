import fetch from "node-fetch";

export const getGoatData = async (sku) => {
  const response = await fetch(
    `https://ac.cnstrc.com/search/${sku}?key=key_XT7bjdbvjgECO5d8&i=6fa7c432-7dc7-4665-af35-97b3286c2343`
  );
  const data = await response.json();

  return data.response;
};
