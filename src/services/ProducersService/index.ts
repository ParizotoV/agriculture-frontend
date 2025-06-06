import type { Producer } from "@/entities/Producer";
import { api } from "../config/axios";

export class ProducersService {
  static async getProducers() {
    const response = await api.get("/producers");
    return response.data;
  }

  static async getProducer(id: string) {
    const response = await api.get(`/producers/${id}`);
    return response.data;
  }

  static async createProducer(producer: Producer) {
    const response = await api.post("/producers", producer);
    return response.data;
  }

  static async updateProducer(id: string, cpfCnpj: string, name: string) {
    const response = await api.put(`/producers/${id}`, {
      cpfCnpj,
      name,
    });
    return response.data;
  }

  static async deleteProducer(id: string) {
    const response = await api.delete(`/producers/${id}`);
    return response.data;
  }
}
