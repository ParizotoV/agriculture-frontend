import type { Farm } from "./Farm";

export interface Crop {
  id?: string;
  season?: string;
  cultureName?: string;
  harvestQuantity?: number | string;
  priceReceived?: number | string;
  farm?: Farm;
  farmId?: string;
}
