import { paystackCollection } from "./paystack";
import { githubCollection } from "./github";
import { openweathermapCollection } from "./openweathermap";
import { coingeckoCollection } from "./coingecko";
import type { Collection, CollectionId } from "@/lib/types";

export const collections: Collection[] = [
  paystackCollection,
  githubCollection,
  openweathermapCollection,
  coingeckoCollection,
];

export function getCollection(id: CollectionId): Collection | undefined {
  return collections.find((c) => c.id === id);
}

export { paystackCollection, githubCollection, openweathermapCollection, coingeckoCollection };
