import { api } from "../config/axios";
import { DashboardService } from "./";

jest.mock("../config/axios", () => ({
  api: {
    get: jest.fn(),
  },
}));

describe("DashboardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getSummary deve chamar api.get('/dashboard') e retornar data", async () => {
    const mockSummary = { totalFarms: 10, totalHectares: 500 };
    (api.get as jest.Mock).mockResolvedValue({ data: mockSummary });

    const result = await DashboardService.getSummary();

    expect(api.get).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual(mockSummary);
  });

  it("getByState deve chamar api.get('/dashboard/by-state') e retornar data", async () => {
    const mockByState = [
      { state: "SP", farmCount: 5 },
      { state: "MG", farmCount: 3 },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: mockByState });

    const result = await DashboardService.getByState();

    expect(api.get).toHaveBeenCalledWith("/dashboard/by-state");
    expect(result).toEqual(mockByState);
  });

  it("getByCulture deve chamar api.get('/dashboard/by-culture') e retornar data", async () => {
    const mockByCulture = [
      {
        cultureName: "Soja",
        count: 8,
        totalHarvest: 200,
        totalRevenue: 10000,
      },
      {
        cultureName: "Milho",
        count: 4,
        totalHarvest: 120,
        totalRevenue: 6000,
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: mockByCulture });

    const result = await DashboardService.getByCulture();

    expect(api.get).toHaveBeenCalledWith("/dashboard/by-culture");
    expect(result).toEqual(mockByCulture);
  });

  it("getByLandUse deve chamar api.get('/dashboard/by-land-use') e retornar data", async () => {
    const mockByLandUse = { agriculturalArea: 300, vegetationArea: 200 };
    (api.get as jest.Mock).mockResolvedValue({ data: mockByLandUse });

    const result = await DashboardService.getByLandUse();

    expect(api.get).toHaveBeenCalledWith("/dashboard/by-land-use");
    expect(result).toEqual(mockByLandUse);
  });
});
