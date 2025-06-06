import type { Producer } from "@/entities/Producer";
import reducer, {
  ProducersState,
  createProducer,
  loadProducerById,
  loadProducers,
  updateProducer,
} from "./producersSlice";

describe("producersSlice reducer e actions", () => {
  const initialState: ProducersState = {
    list: [],
    loading: false,
    error: null,
  };

  const sampleProducer1: Producer = {
    id: "p1",
    name: "Ana Silva",
    cpfCnpj: "12345678900",
  };
  const sampleProducer2: Producer = {
    id: "p2",
    name: "João Souza",
    cpfCnpj: "09876543211",
  };

  it("retorna estado inicial para action desconhecida", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("loadProducerById extraReducers", () => {
    it("pending: seta loading=true e limpa error", () => {
      const action = { type: loadProducerById.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: substitui lista com o producer carregado", () => {
      const action = {
        type: loadProducerById.fulfilled.type,
        payload: sampleProducer1,
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleProducer1],
        loading: false,
        error: null,
      });
    });

    it("rejected: seta error a partir de action.error.message", () => {
      const action = {
        type: loadProducerById.rejected.type,
        error: { message: "Erro ao carregar producer" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao carregar producer",
      });
    });
  });

  describe("loadProducers extraReducers", () => {
    it("pending: seta loading=true e limpa error", () => {
      const action = { type: loadProducers.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: preenche lista com producers retornados", () => {
      const action = {
        type: loadProducers.fulfilled.type,
        payload: [sampleProducer1, sampleProducer2],
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleProducer1, sampleProducer2],
        loading: false,
        error: null,
      });
    });

    it("rejected: seta error a partir de action.error.message", () => {
      const action = {
        type: loadProducers.rejected.type,
        error: { message: "Erro ao carregar produtores" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao carregar produtores",
      });
    });
  });

  describe("createProducer extraReducers", () => {
    it("pending: seta loading=true e limpa error", () => {
      const action = { type: createProducer.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: adiciona novo producer à lista", () => {
      const action = {
        type: createProducer.fulfilled.type,
        payload: sampleProducer1,
      };
      const prev = { ...initialState, list: [sampleProducer2], loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [sampleProducer2, sampleProducer1],
        loading: false,
        error: null,
      });
    });

    it("rejected: seta error a partir de action.error.message", () => {
      const action = {
        type: createProducer.rejected.type,
        error: { message: "Erro ao criar produtor" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao criar produtor",
      });
    });
  });

  describe("updateProducer extraReducers", () => {
    it("pending: seta loading=true e limpa error", () => {
      const action = { type: updateProducer.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ list: [], loading: true, error: null });
    });

    it("fulfilled: substitui producer existente pelo atualizado", () => {
      const updated: Producer = { ...sampleProducer1, name: "Ana Silva Jr." };
      const action = {
        type: updateProducer.fulfilled.type,
        payload: updated,
      };
      const prev = {
        ...initialState,
        list: [sampleProducer1, sampleProducer2],
        loading: true,
      };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [updated, sampleProducer2],
        loading: false,
        error: null,
      });
    });

    it("rejected: seta error a partir de action.error.message", () => {
      const action = {
        type: updateProducer.rejected.type,
        error: { message: "Erro ao atualizar produtor" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        list: [],
        loading: false,
        error: "Erro ao atualizar produtor",
      });
    });
  });
});
