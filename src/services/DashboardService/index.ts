import { api } from "../config/axios";

export class DashboardService {
  static async getSummary() {
    const response = await api.get("/dashboard");
    return response.data;
  }

  static async getByState() {
    const response = await api.get(`/dashboard/by-state`);
    return response.data;
  }

  static async getByCulture() {
    const response = await api.get(`/dashboard/by-culture`);
    return response.data;
  }

  static async getByLandUse() {
    const response = await api.get(`/dashboard/by-land-use`);
    return response.data;
  }
}
