import { loadCrops } from "@/features/cultures/culturesSlice";
import { loadDashboard, setSummary } from "@/features/dashboard/dashboardSlice";
import { clearFarms, loadFarms } from "@/features/farms/farmsSlice";
import { loadProducers } from "@/features/producers/producersSlice";
import { store, type RootState } from "./store";

describe("store Redux", () => {
  it("deve ter o estado inicial correto para cada slice", () => {
    const state: RootState = store.getState();

    expect(state.producers.list).toEqual([]);
    expect(state.producers.loading).toBe(false);
    expect(state.producers.error).toBeNull();

    expect(state.farms.list).toEqual([]);
    expect(state.farms.loading).toBe(false);
    expect(state.farms.error).toBeNull();

    expect(state.cultures.list).toEqual([]);
    expect(state.cultures.loading).toBe(false);
    expect(state.cultures.error).toBeNull();

    expect(state.dashboard.summary).toEqual({
      totalFarms: 0,
      totalHectares: 0,
    });
    expect(state.dashboard.byState).toEqual([]);
    expect(state.dashboard.byCulture).toEqual([]);
    expect(state.dashboard.byLandUse).toEqual({
      agriculturalArea: 0,
      vegetationArea: 0,
    });
    expect(state.dashboard.loading).toBe(false);
    expect(state.dashboard.error).toBeNull();
  });

  it("dispatch de ação síncrona setSummary deve atualizar dashboard.summary", () => {
    const newSummary = { totalFarms: 10, totalHectares: 2000 };
    store.dispatch(setSummary(newSummary));

    const state: RootState = store.getState();
    expect(state.dashboard.summary).toEqual(newSummary);
    store.dispatch(setSummary({ totalFarms: 0, totalHectares: 0 }));
  });

  it("dispatch de thunk loadFarms deve acomodar loading true, depois fulfilled ou rejected", async () => {
    const pendingAction = { type: loadFarms.pending.type };
    store.dispatch(pendingAction);
    let state: RootState = store.getState();
    expect(state.farms.loading).toBe(true);
    const rejectedAction = {
      type: loadFarms.rejected.type,
      error: { message: "Erro teste" },
    };
    store.dispatch(rejectedAction);
    state = store.getState();
    expect(state.farms.loading).toBe(false);
    expect(state.farms.error).toBe("Erro teste");
  });

  it("dispatch de thunk clearFarms deve limpar a lista de farms", () => {
    const dummyFarm = {
      id: "dummy",
      name: "Dummy",
      city: "X",
      state: "Y",
      totalArea: 1,
      agriculturalArea: 1,
      vegetationArea: 0,
      producerId: "p",
    };
    const fulfilledLoad = {
      type: loadFarms.fulfilled.type,
      payload: [dummyFarm],
    };
    store.dispatch(fulfilledLoad);
    let state: RootState = store.getState();
    expect(state.farms.list).toEqual([dummyFarm]);

    store.dispatch(clearFarms());
    state = store.getState();
    expect(state.farms.list).toEqual([]);
    expect(state.farms.loading).toBe(false);
    expect(state.farms.error).toBeNull();
  });

  it("dispatch de loadProducers e loadCrops pendentes devem setar loading true", () => {
    store.dispatch({ type: loadProducers.pending.type });
    let state: RootState = store.getState();
    expect(state.producers.loading).toBe(true);

    store.dispatch({ type: loadCrops.pending.type });
    state = store.getState();
    expect(state.cultures.loading).toBe(true);

    store.dispatch({
      type: loadProducers.rejected.type,
      error: { message: "reset" },
    });
    store.dispatch({
      type: loadCrops.rejected.type,
      error: { message: "reset" },
    });
  });

  it("dispatch de loadDashboard pendente e rejeitado devem funcionar corretamente", () => {
    store.dispatch({ type: loadDashboard.pending.type });
    let state: RootState = store.getState();
    expect(state.dashboard.loading).toBe(true);

    store.dispatch({
      type: loadDashboard.rejected.type,
      error: { message: "Erro dashboard" },
    });
    state = store.getState();
    expect(state.dashboard.loading).toBe(false);
    expect(state.dashboard.error).toBe("Erro dashboard");

    store.dispatch(setSummary({ totalFarms: 0, totalHectares: 0 }));
  });
});
