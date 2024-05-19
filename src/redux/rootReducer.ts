import { combineReducers } from "@reduxjs/toolkit";
import workspace from "./reducers/workspace";

export const rootReducer = combineReducers({
  workspace,
});
