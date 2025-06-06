import type { Farm } from "@/entities/Farm";
import { api } from "../config/axios";
import { FarmsService } from "./";

jest.mock("../config/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("FarmsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getFarms deve chamar api.get('/farms') e retornar data", async () => {
    const mockFarms: Farm[] = [
      {
        id: "1",
        name: "Fazenda A",
        city: "São Paulo",
        state: "SP",
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        producerId: "p1",
      },
      {
        id: "2",
        name: "Fazenda B",
        city: "Belo Horizonte",
        state: "MG",
        totalArea: 200,
        agriculturalArea: 120,
        vegetationArea: 80,
        producerId: "p2",
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: mockFarms });

    const result = await FarmsService.getFarms();

    expect(api.get).toHaveBeenCalledWith("/farms");
    expect(result).toEqual(mockFarms);
  });

  it("getFarm deve chamar api.get(`/farms/${id}`) e retornar data", async () => {
    const mockFarm: Farm = {
      id: "1",
      name: "Fazenda A",
      city: "São Paulo",
      state: "SP",
      totalArea: 100,
      agriculturalArea: 60,
      vegetationArea: 40,
      producerId: "p1",
    };
    (api.get as jest.Mock).mockResolvedValue({ data: mockFarm });

    const result = await FarmsService.getFarm("1");

    expect(api.get).toHaveBeenCalledWith("/farms/1");
    expect(result).toEqual(mockFarm);
  });

  it("createFarm deve chamar api.post('/farms', farm) e retornar data", async () => {
    const newFarm: Farm = {
      id: "3",
      name: "Fazenda C",
      city: "Curitiba",
      state: "PR",
      totalArea: 150,
      agriculturalArea: 90,
      vegetationArea: 60,
      producerId: "p3",
    };
    (api.post as jest.Mock).mockResolvedValue({ data: newFarm });

    const result = await FarmsService.createFarm(newFarm);

    expect(api.post).toHaveBeenCalledWith("/farms", newFarm);
    expect(result).toEqual(newFarm);
  });

  it("updateFarm deve chamar api.put(`/farms/${id}`, farm) e retornar data", async () => {
    const updatedFarm: Farm = {
      id: "2",
      name: "Fazenda B Atualizada",
      city: "Belo Horizonte",
      state: "MG",
      totalArea: 250,
      agriculturalArea: 150,
      vegetationArea: 100,
      producerId: "p2",
    };
    (api.put as jest.Mock).mockResolvedValue({ data: updatedFarm });

    const result = await FarmsService.updateFarm("2", updatedFarm);

    expect(api.put).toHaveBeenCalledWith("/farms/2", updatedFarm);
    expect(result).toEqual(updatedFarm);
  });

  it("deleteFarm deve chamar api.delete(`/farms/${id}`) e retornar data", async () => {
    const mockResponse = { success: true };
    (api.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await FarmsService.deleteFarm("2");

    expect(api.delete).toHaveBeenCalledWith("/farms/2");
    expect(result).toEqual(mockResponse);
  });
});
