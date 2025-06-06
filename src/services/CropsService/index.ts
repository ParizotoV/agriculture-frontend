import { Crop } from "@/entities/Crop";
import { api } from "../config/axios";

export class CropsService {
  static async getCrops() {
    const response = await api.get("/crops");
    return response.data;
  }

  static async getCrop(id: string) {
    const response = await api.get(`/crops/${id}`);
    return response.data;
  }

  static async createCrop(crop: Crop) {
    const response = await api.post("/crops", crop);
    return response.data;
  }

  static async updateCrop(id: string, crop: Crop) {
    const response = await api.put(`/crops/${id}`, crop);
    return response.data;
  }

  static async deleteCrop(id: string) {
    const response = await api.delete(`/crops/${id}`);
    return response.data;
  }
}
