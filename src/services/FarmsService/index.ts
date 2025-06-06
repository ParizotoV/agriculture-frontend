import { Farm } from "@/entities/Farm";
import { api } from "../config/axios";

export class FarmsService {
  static async getFarms() {
    const response = await api.get("/farms");
    return response.data;
  }

  static async getFarm(id: string) {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  }

  static async createFarm(farm: Farm) {
    const response = await api.post("/farms", farm);
    return response.data;
  }

  static async updateFarm(id: string, farm: Farm) {
    const response = await api.put(`/farms/${id}`, farm);
    return response.data;
  }

  static async deleteFarm(id: string) {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  }
}
