import culturesReducer from "@/features/cultures/culturesSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import farmsReducer from "@/features/farms/farmsSlice";
import producersReducer from "@/features/producers/producersSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    producers: producersReducer,
    farms: farmsReducer,
    cultures: culturesReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
