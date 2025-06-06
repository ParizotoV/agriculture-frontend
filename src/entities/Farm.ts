import type { Crop } from "./Crop";
import type { Producer } from "./Producer";

export interface Farm {
  id?: string;
  name?: string;
  city?: string;
  state?: string;
  totalArea?: number;
  agriculturalArea?: number;
  vegetationArea?: number;
  producer?: Producer;
  producerId?: string;
  crops?: Crop[];
}
