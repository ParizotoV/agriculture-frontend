import type { Farm } from "./Farm";

export interface Producer {
  id?: string;
  name?: string;
  cpfCnpj?: string;
  farms?: Farm[];
}
