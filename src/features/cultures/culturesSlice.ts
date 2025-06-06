import type { Crop } from "@/entities/Crop";
import { CropsService } from "@/services/CropsService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

export interface CropsState {
  list: Crop[];
  loading: boolean;
  error: string | null;
}

const initialState: CropsState = {
  list: [],
  loading: false,
  error: null,
};

export const loadCrops = createAsyncThunk<Crop[]>(
  "crops/loadCrops",
  async () => {
    return await CropsService.getCrops();
  }
);

export const loadCropById = createAsyncThunk<Crop, string>(
  "crops/loadCropById",
  async (id) => {
    return await CropsService.getCrop(id);
  }
);

export const deleteCrop = createAsyncThunk<
  Crop,
  string,
  { rejectValue: string }
>("crops/deleteCrop", async (id, { rejectWithValue }) => {
  try {
    return await CropsService.deleteCrop(id);
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro ao deletar cultura"
    );
  }
});

export const createCrop = createAsyncThunk<
  Crop,
  {
    farmId: string;
    cultureName: string;
    season: string;
    harvestQuantity: number;
    priceReceived: number;
  },
  { rejectValue: string }
>("crops/createCrop", async (payload, { rejectWithValue }) => {
  try {
    const response = await CropsService.createCrop(payload);
    return response;
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro desconhecido ao criar cultura"
    );
  }
});

export const updateCrop = createAsyncThunk<
  Crop,
  { id: string; data: Partial<Omit<Crop, "id" | "farmId">> },
  { rejectValue: string }
>("crops/updateCrop", async (payload, { rejectWithValue }) => {
  try {
    const response = await CropsService.updateCrop(payload.id, payload.data);
    return response;
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro desconhecido ao atualizar cultura"
    );
  }
});

const cropsSlice = createSlice({
  name: "crops",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCropById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCropById.fulfilled, (state, action: PayloadAction<Crop>) => {
        state.loading = false;
        state.list = [action.payload];
      })
      .addCase(loadCropById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar cultura";
      });

    builder
      .addCase(loadCrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCrops.fulfilled, (state, action: PayloadAction<Crop[]>) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadCrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar culturas";
      });

    builder
      .addCase(createCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCrop.fulfilled, (state, action: PayloadAction<Crop>) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao criar cultura";
      });

    builder
      .addCase(updateCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCrop.fulfilled, (state, action: PayloadAction<Crop>) => {
        state.loading = false;
        state.list = state.list.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      })
      .addCase(updateCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao atualizar cultura";
      });

    builder
      .addCase(deleteCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCrop.fulfilled, (state, action: PayloadAction<Crop>) => {
        state.loading = false;
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao remover cultura";
      });
  },
});

export default cropsSlice.reducer;
