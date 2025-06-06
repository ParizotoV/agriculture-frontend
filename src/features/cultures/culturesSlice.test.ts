import type { Crop } from "@/entities/Crop";
import reducer, {
  createCrop,
  CropsState,
  deleteCrop,
  loadCropById,
  loadCrops,
  updateCrop,
} from "./culturesSlice";

describe("culturesSlice reducer e actions", () => {
  const initialState: CropsState = {
    list: [],
    loading: false,
    error: null,
  };

  const sampleCrop1: Crop = {
    id: "c1",
    farmId: "f1",
    cultureName: "Soja",
    season: "2024",
    harvestQuantity: 100,
    priceReceived: 2500,
  };
  const sampleCrop2: Crop = {
    id: "c2",
    farmId: "f2",
    cultureName: "Milho",
    season: "2023",
    harvestQuantity: 200,
    priceReceived: 1800,
  };

  it("deve retornar o estado inicial quando action desconhecida", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("loadCropById", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: loadCropById.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve preencher lista apenas com o crop carregado", () => {
      const action = {
        type: loadCropById.fulfilled.type,
        payload: sampleCrop1,
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleCrop1],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.error.message", () => {
      const action = {
        type: loadCropById.rejected.type,
        error: { message: "Erro ao buscar crop" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao buscar crop",
      });
    });
  });

  describe("loadCrops", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: loadCrops.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve preencher lista com todos os crops", () => {
      const action = {
        type: loadCrops.fulfilled.type,
        payload: [sampleCrop1, sampleCrop2],
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleCrop1, sampleCrop2],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.error.message", () => {
      const action = {
        type: loadCrops.rejected.type,
        error: { message: "Falha ao carregar crops" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Falha ao carregar crops",
      });
    });
  });

  describe("createCrop", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: createCrop.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve adicionar novo crop à lista", () => {
      const action = {
        type: createCrop.fulfilled.type,
        payload: sampleCrop1,
      };
      const prev = { ...initialState, list: [sampleCrop2], loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleCrop2, sampleCrop1],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.payload", () => {
      const action = {
        type: createCrop.rejected.type,
        payload: "Erro ao criar cultura",
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao criar cultura",
      });
    });
  });

  describe("updateCrop", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: updateCrop.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve substituir o crop existente pelo atualizado", () => {
      const updated: Crop = { ...sampleCrop1, cultureName: "Soja Premium" };
      const action = {
        type: updateCrop.fulfilled.type,
        payload: updated,
      };
      const prev = {
        ...initialState,
        list: [sampleCrop1, sampleCrop2],
        loading: true,
      };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [updated, sampleCrop2],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.payload", () => {
      const action = {
        type: updateCrop.rejected.type,
        payload: "Erro ao atualizar cultura",
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao atualizar cultura",
      });
    });
  });

  describe("deleteCrop", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: deleteCrop.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve remover o crop da lista pelo id", () => {
      const action = {
        type: deleteCrop.fulfilled.type,
        payload: sampleCrop1.id,
      };
      const prev = {
        ...initialState,
        list: [sampleCrop1, sampleCrop2],
        loading: true,
      };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleCrop2],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.error.message", () => {
      const action = {
        type: deleteCrop.rejected.type,
        error: { message: "Erro ao deletar cultura" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao deletar cultura",
      });
    });
  });
});
