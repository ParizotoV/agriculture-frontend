import reducer, {
  DashboardState,
  loadDashboard,
  setSummary,
} from "./dashboardSlice";

describe("dashboardSlice reducer e actions", () => {
  const initialState: DashboardState = {
    summary: {
      totalFarms: 0,
      totalHectares: 0,
    },
    byState: [],
    byCulture: [],
    byLandUse: {
      agriculturalArea: 0,
      vegetationArea: 0,
    },
    loading: false,
    error: null,
  };

  const sampleSummary = { totalFarms: 5, totalHectares: 1200 };
  const sampleByState = [
    { state: "SP", farmCount: 3 },
    { state: "MG", farmCount: 2 },
  ];
  const sampleByCulture = [
    {
      cultureName: "Soja",
      count: 4,
      totalHarvest: 500,
      totalRevenue: 10000,
    },
    {
      cultureName: "Milho",
      count: 3,
      totalHarvest: 300,
      totalRevenue: 6000,
    },
  ];
  const sampleByLandUse = { agriculturalArea: 800, vegetationArea: 400 };

  it("deve retornar o estado inicial quando action desconhecida", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("reducers internos", () => {
    it("setSummary: deve atualizar apenas o summary", () => {
      const newSummary = { totalFarms: 10, totalHectares: 2000 };
      const action = setSummary(newSummary);
      const prev = { ...initialState, summary: sampleSummary };
      const state = reducer(prev, action);
      expect(state.summary).toEqual(newSummary);
      expect(state.byState).toEqual(prev.byState);
      expect(state.byCulture).toEqual(prev.byCulture);
      expect(state.byLandUse).toEqual(prev.byLandUse);
      expect(state.loading).toBe(prev.loading);
      expect(state.error).toBe(prev.error);
    });
  });

  describe("loadDashboard extraReducers", () => {
    it("pending: deve setar loading=true e limpar error", () => {
      const action = { type: loadDashboard.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it("fulfilled: deve popular o estado com payload retornado", () => {
      const payload = {
        summary: sampleSummary,
        byState: sampleByState,
        byCulture: sampleByCulture,
        byLandUse: sampleByLandUse,
        loading: false,
        error: null,
      };
      const action = {
        type: loadDashboard.fulfilled.type,
        payload,
      };
      const prev = { ...initialState, loading: true, error: "algum erro" };
      const state = reducer(prev, action);
      expect(state).toEqual({
        summary: sampleSummary,
        byState: sampleByState,
        byCulture: sampleByCulture,
        byLandUse: sampleByLandUse,
        loading: false,
        error: null,
      });
    });

    it("rejected: deve setar loading=false e error a partir de action.error.message", () => {
      const action = {
        type: loadDashboard.rejected.type,
        error: { message: "Falha no carregamento" },
      };
      const prev = { ...initialState, loading: true };
      const state = reducer(prev, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: "Falha no carregamento",
      });
    });
  });
});
