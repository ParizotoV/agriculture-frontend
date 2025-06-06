import type { Producer } from "@/entities/Producer";
import { api } from "../config/axios";
import { ProducersService } from "./";

jest.mock("../config/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("ProducersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getProducers deve chamar api.get('/producers') e retornar data", async () => {
    const mockProducers: Producer[] = [
      { id: "1", name: "Ana", cpfCnpj: "11122233344", farms: [] },
      { id: "2", name: "Bruno", cpfCnpj: "55566677788", farms: [] },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducers });

    const result = await ProducersService.getProducers();

    expect(api.get).toHaveBeenCalledWith("/producers");
    expect(result).toEqual(mockProducers);
  });

  it("getProducer deve chamar api.get(`/producers/${id}`) e retornar data", async () => {
    const mockProducer: Producer = {
      id: "1",
      name: "Ana",
      cpfCnpj: "11122233344",
      farms: ["f1"],
    };
    (api.get as jest.Mock).mockResolvedValue({ data: mockProducer });

    const result = await ProducersService.getProducer("1");

    expect(api.get).toHaveBeenCalledWith("/producers/1");
    expect(result).toEqual(mockProducer);
  });

  it("createProducer deve chamar api.post('/producers', producer) e retornar data", async () => {
    const newProducer: Producer = {
      id: "3",
      name: "Carlos",
      cpfCnpj: "99988877766",
      farms: [],
    };
    (api.post as jest.Mock).mockResolvedValue({ data: newProducer });

    const result = await ProducersService.createProducer(newProducer);

    expect(api.post).toHaveBeenCalledWith("/producers", newProducer);
    expect(result).toEqual(newProducer);
  });

  it("updateProducer deve chamar api.put(`/producers/${id}`, { cpfCnpj, name }) e retornar data", async () => {
    const updatedProducer: Producer = {
      id: "2",
      name: "Bruno Atualizado",
      cpfCnpj: "55566677799",
      farms: ["f2", "f3"],
    };
    (api.put as jest.Mock).mockResolvedValue({ data: updatedProducer });

    const result = await ProducersService.updateProducer(
      "2",
      updatedProducer.cpfCnpj || "55566677799",
      updatedProducer.name || "Bruno Atualizado"
    );

    expect(api.put).toHaveBeenCalledWith("/producers/2", {
      cpfCnpj: "55566677799",
      name: "Bruno Atualizado",
    });
    expect(result).toEqual(updatedProducer);
  });

  it("deleteProducer deve chamar api.delete(`/producers/${id}`) e retornar data", async () => {
    const mockResponse = { success: true };
    (api.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await ProducersService.deleteProducer("2");

    expect(api.delete).toHaveBeenCalledWith("/producers/2");
    expect(result).toEqual(mockResponse);
  });
});
