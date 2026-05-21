import type { Collection } from "@/lib/types";

export const coingeckoCollection: Collection = {
  id: "coingecko",
  name: "CoinGecko",
  baseUrl: "https://api.coingecko.com/api/v3",
  authType: "none",
  endpoints: [
    {
      id: "cg-list-markets",
      name: "List Markets",
      category: "Coins",
      method: "GET",
      path: "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5",
      description: "List top coins by market cap",
    },
    {
      id: "cg-get-coin",
      name: "Get Coin",
      category: "Coins",
      method: "GET",
      path: "/coins/:id",
      params: [{ name: "id", defaultValue: "bitcoin", description: "Coin ID" }],
      description: "Get detailed info for a specific coin",
    },
    {
      id: "cg-simple-price",
      name: "Simple Price",
      category: "Simple",
      method: "GET",
      path: "/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd",
      description: "Get current price for multiple coins",
    },
    {
      id: "cg-trending",
      name: "Trending",
      category: "Search",
      method: "GET",
      path: "/search/trending",
      description: "Get trending coins in the last 24 hours",
    },
  ],
};
