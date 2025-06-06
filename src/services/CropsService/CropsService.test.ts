import type { Crop } from "@/entities/Crop";
import { api } from "../config/axios";
import { CropsService } from "./";

jest.mock("../config/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("CropsService", () => {
  const mockCrop: Crop = {
    id: "1",
    farmId: "f1",
    cultureName: "Soja",
    season: "2022",
    harvestQuantity: 100,
    priceReceived: 250,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getCrops deve chamar api.get('/crops') e retornar data", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [mockCrop] });

    const result = await CropsService.getCrops();

    expect(api.get).toHaveBeenCalledWith("/crops");

    expect(result).toEqual([mockCrop]);
  });

  it("getCrop deve chamar api.get(`/crops/${id}`) e retornar data", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockCrop });

    const result = await CropsService.getCrop("1");
    expect(api.get).toHaveBeenCalledWith("/crops/1");
    expect(result).toEqual(mockCrop);
  });

  it("createCrop deve chamar api.post('/crops', crop) e retornar data", async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockCrop });

    const result = await CropsService.createCrop(mockCrop);
    expect(api.post).toHaveBeenCalledWith("/crops", mockCrop);
    expect(result).toEqual(mockCrop);
  });

  it("updateCrop deve chamar api.put(`/crops/${id}`, crop) e retornar data", async () => {
    (api.put as jest.Mock).mockResolvedValue({ data: mockCrop });

    const result = await CropsService.updateCrop("1", mockCrop);
    expect(api.put).toHaveBeenCalledWith("/crops/1", mockCrop);
    expect(result).toEqual(mockCrop);
  });

  it("deleteCrop deve chamar api.delete(`/crops/${id}`) e retornar data", async () => {
    (api.delete as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await CropsService.deleteCrop("1");
    expect(api.delete).toHaveBeenCalledWith("/crops/1");
    expect(result).toEqual({ success: true });
  });
});
