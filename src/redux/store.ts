import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
});

export type OverallState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
