import { DashboardService } from "@/services/DashboardService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardPayload {
  summary: {
    totalFarms: number;
    totalHectares: number;
  };
  byState: {
    state: string;
    farmCount: number;
  }[];
  byCulture: {
    cultureName: string;
    count: number;
    totalHarvest: number;
    totalRevenue: number;
  }[];
  byLandUse: {
    agriculturalArea: number;
    vegetationArea: number;
  };
  loading: boolean;
  error: string | null;
}

export interface DashboardState {
  summary: {
    totalFarms: number;
    totalHectares: number;
  };
  byState: {
    state: string;
    farmCount: number;
  }[];
  byCulture: {
    cultureName: string;
    count: number;
    totalHarvest: number;
    totalRevenue: number;
  }[];
  byLandUse: {
    agriculturalArea: number;
    vegetationArea: number;
  };
  loading: boolean;
  error: string | null;
}

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

export const loadDashboard = createAsyncThunk<DashboardPayload, void>(
  "dashboard/loadDashboard",
  async () => {
    const responseSummary = await DashboardService.getSummary();
    const responseByState = await DashboardService.getByState();
    const responseByCulture = await DashboardService.getByCulture();
    const responseByLandUse = await DashboardService.getByLandUse();

    if (
      responseSummary.error ||
      responseByState.error ||
      responseByCulture.error ||
      responseByLandUse.error
    ) {
      return {
        summary: { totalFarms: 0, totalHectares: 0 },
        byState: [],
        byCulture: [],
        byLandUse: { agriculturalArea: 0, vegetationArea: 0 },
        loading: false,
        error: "Erro ao carregar dashboard",
      };
    }

    return {
      summary: responseSummary,
      byState: responseByState,
      byCulture: responseByCulture,
      byLandUse: responseByLandUse,
      loading: false,
      error: null,
    };
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSummary(state, action: PayloadAction<DashboardState["summary"]>) {
      state.summary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.byState = action.payload.byState;
        state.byCulture = action.payload.byCulture;
        state.byLandUse = action.payload.byLandUse;
        state.error = null;
      })
      .addCase(loadDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Erro ao carregar dashboard";
      });
  },
});

export const { setSummary } = dashboardSlice.actions;
export default dashboardSlice.reducer;
