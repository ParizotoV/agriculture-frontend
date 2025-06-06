import type { Farm } from "@/entities/Farm";
import { FarmsService } from "@/services/FarmsService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

export interface FarmsState {
  list: Farm[];
  loading: boolean;
  error: string | null;
}

const initialState: FarmsState = {
  list: [],
  loading: false,
  error: null,
};

export const loadFarms = createAsyncThunk<Farm[]>(
  "farms/loadFarms",
  async () => {
    return await FarmsService.getFarms();
  }
);

export const loadFarmById = createAsyncThunk<Farm, string>(
  "farms/loadFarmById",
  async (id) => {
    return await FarmsService.getFarm(id);
  }
);

export const createFarm = createAsyncThunk<
  Farm,
  { data: Farm },
  { rejectValue: string }
>("farms/createFarm", async ({ data }, { rejectWithValue }) => {
  try {
    return await FarmsService.createFarm(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string[] })?.message[0] ||
        "Erro ao criar fazenda"
    );
  }
});

export const updateFarm = createAsyncThunk<
  Farm,
  { id: string; data: Partial<Farm> },
  { rejectValue: string }
>("farms/updateFarm", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await FarmsService.updateFarm(id, data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro ao atualizar fazenda"
    );
  }
});

export const deleteFarm = createAsyncThunk<
  Farm,
  string,
  { rejectValue: string }
>("farms/deleteFarm", async (id, { rejectWithValue }) => {
  try {
    return await FarmsService.deleteFarm(id);
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro ao deletar fazenda"
    );
  }
});

const farmsSlice = createSlice({
  name: "farms",
  initialState,
  reducers: {
    clearFarms(state) {
      state.list = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFarms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFarms.fulfilled, (state, action: PayloadAction<Farm[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadFarms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar fazendas";
      });

    builder
      .addCase(loadFarmById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFarmById.fulfilled, (state, action: PayloadAction<Farm>) => {
        state.loading = false;
        state.list = [action.payload];
      })
      .addCase(loadFarmById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar fazenda";
      });

    builder
      .addCase(createFarm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFarm.fulfilled, (state, action: PayloadAction<Farm>) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createFarm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao criar fazenda";
      });

    builder
      .addCase(updateFarm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarm.fulfilled, (state, action: PayloadAction<Farm>) => {
        state.loading = false;
        state.list = state.list.map((farm) =>
          farm.id === action.payload.id ? action.payload : farm
        );
      })
      .addCase(updateFarm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao atualizar fazenda";
      });

    builder
      .addCase(deleteFarm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFarm.fulfilled, (state, action: PayloadAction<Farm>) => {
        state.loading = false;
        state.list = state.list.filter((farm) => farm.id !== action.payload.id);
      })
      .addCase(deleteFarm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao deletar fazenda";
      });
  },
});

export const { clearFarms } = farmsSlice.actions;
export default farmsSlice.reducer;
