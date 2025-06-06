import type { Farm } from "@/entities/Farm";
import reducer, {
  clearFarms,
  createFarm,
  FarmsState,
  loadFarmById,
  loadFarms,
  updateFarm,
} from "./farmsSlice";

describe("farmsSlice reducer e actions", () => {
  const initialState: FarmsState = {
    list: [],
    loading: false,
    error: null,
  };

  const sampleFarm1: Farm = {
    id: "f1",
    name: "Fazenda A",
    city: "CidadeX",
    state: "SP",
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 40,
    producerId: "p1",
  };
  const sampleFarm2: Farm = {
    id: "f2",
    name: "Fazenda B",
    city: "CidadeY",
    state: "MG",
    totalArea: 200,
    agriculturalArea: 150,
    vegetationArea: 50,
    producerId: "p2",
  };

  it("deve retornar o estado inicial quando action desconhecida", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("reducers internos", () => {
    it("clearFarms: deve limpar a lista, loading e error", () => {
      const prev: FarmsState = {
        list: [sampleFarm1, sampleFarm2],
        loading: true,
        error: "Erro qualquer",
      };
      const state = reducer(prev, clearFarms());
      expect(state).toEqual(initialState);
    });
  });

  describe("loadFarms extraReducers", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: loadFarms.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve preencher lista com farms retornadas", () => {
      const action = {
        type: loadFarms.fulfilled.type,
        payload: [sampleFarm1, sampleFarm2],
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleFarm1, sampleFarm2],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.error.message", () => {
      const action = {
        type: loadFarms.rejected.type,
        error: { message: "Falha ao carregar fazendas" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Falha ao carregar fazendas",
      });
    });
  });

  describe("loadFarmById extraReducers", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: loadFarmById.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve substituir lista apenas com o farm carregado", () => {
      const action = {
        type: loadFarmById.fulfilled.type,
        payload: sampleFarm1,
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleFarm1],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.error.message", () => {
      const action = {
        type: loadFarmById.rejected.type,
        error: { message: "Erro ao carregar fazenda" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao carregar fazenda",
      });
    });
  });

  describe("createFarm extraReducers", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: createFarm.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve adicionar novo farm à lista", () => {
      const action = {
        type: createFarm.fulfilled.type,
        payload: sampleFarm1,
      };
      const prev = { ...initialState, list: [sampleFarm2], loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleFarm2, sampleFarm1],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.payload", () => {
      const action = {
        type: createFarm.rejected.type,
        payload: "Erro ao criar fazenda",
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao criar fazenda",
      });
    });
  });

  describe("updateFarm extraReducers", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: updateFarm.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: deve substituir o farm existente pelo atualizado", () => {
      const updated: Farm = { ...sampleFarm1, name: "Fazenda A+" };
      const action = {
        type: updateFarm.fulfilled.type,
        payload: updated,
      };
      const prev = {
        ...initialState,
        list: [sampleFarm1, sampleFarm2],
        loading: true,
      };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [updated, sampleFarm2],
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar error a partir de action.payload", () => {
      const action = {
        type: updateFarm.rejected.type,
        payload: "Erro ao atualizar fazenda",
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao atualizar fazenda",
      });
    });
  });
});
