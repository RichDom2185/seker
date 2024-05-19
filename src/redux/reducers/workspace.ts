import { createSlice } from "@reduxjs/toolkit";
import { Languages } from "../../utils/constants";

type WorkspaceState = {
  currentLanguage: Languages;
};

const initialState: WorkspaceState = {
  currentLanguage: Languages.PYTHON,
};

const WorkspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const WorkspaceActions = WorkspaceSlice.actions;

export default WorkspaceSlice.reducer;
