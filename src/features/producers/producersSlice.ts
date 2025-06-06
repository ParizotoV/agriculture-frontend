import { Producer } from "@/entities/Producer";
import { ProducersService } from "@/services/ProducersService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

export interface ProducersState {
  list: Producer[];
  loading: boolean;
  error: string | null;
}

const initialState: ProducersState = {
  list: [],
  loading: false,
  error: null,
};

export const loadProducers = createAsyncThunk(
  "producers/loadProducers",
  async () => {
    const response = await ProducersService.getProducers();
    return response;
  }
);

export const loadProducerById = createAsyncThunk(
  "producers/loadProducerById",
  async (id: string) => {
    const response = await ProducersService.getProducer(id);
    return response;
  }
);

export const createProducer = createAsyncThunk<
  Producer,
  { name: string; cpfCnpj: string },
  { rejectValue: string }
>("producers/createProducer", async (payload, { rejectWithValue }) => {
  try {
    const response = await ProducersService.createProducer(payload);
    return response;
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro desconhecido ao criar produtor"
    );
  }
});

export const updateProducer = createAsyncThunk<
  Producer,
  { id: string; cpfCnpj: string; name: string },
  { rejectValue: string }
>("producers/updateProducer", async (payload, { rejectWithValue }) => {
  try {
    const response = await ProducersService.updateProducer(
      payload.id,
      payload.cpfCnpj,
      payload.name
    );
    return response;
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro desconhecido ao atualizar produtor"
    );
  }
});

export const deleteProducer = createAsyncThunk<
  Producer,
  string,
  { rejectValue: string }
>("producers/deleteProducer", async (id, { rejectWithValue }) => {
  try {
    const response = await ProducersService.deleteProducer(id);
    return response;
  } catch (err) {
    const axiosError = err as AxiosError;
    return rejectWithValue(
      (axiosError?.response?.data as { message: string })?.message ||
        "Erro desconhecido ao deletar produtor"
    );
  }
});

const producersSlice = createSlice({
  name: "producers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadProducerById.fulfilled,
        (state, action: PayloadAction<Producer>) => {
          state.loading = false;
          state.list = [action.payload];
        }
      )
      .addCase(loadProducerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar produtor";
      });

    builder
      .addCase(loadProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loadProducers.fulfilled,
        (state, action: PayloadAction<Producer[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(loadProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar produtores";
      });

    builder
      .addCase(createProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProducer.fulfilled,
        (state, action: PayloadAction<Producer>) => {
          state.loading = false;
          state.list.push(action.payload);
        }
      )
      .addCase(createProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao criar produtor";
      });

    builder
      .addCase(updateProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProducer.fulfilled,
        (state, action: PayloadAction<Producer>) => {
          state.loading = false;
          state.list = state.list.map((producer) =>
            producer.id === action.payload.id ? action.payload : producer
          );
        }
      )
      .addCase(updateProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao atualizar produtor";
      });

    builder
      .addCase(deleteProducer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProducer.fulfilled,
        (state, action: PayloadAction<Producer>) => {
          state.loading = false;
          state.list = state.list.filter(
            (producer) => producer.id !== action.payload.id
          );
        }
      )
      .addCase(deleteProducer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao deletar produtor";
      });
  },
});

export default producersSlice.reducer;
