import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Languages } from "../../utils/constants";
import { defaultPrograms } from "../../utils/programs";

type WorkspaceState = {
  currentLanguage: Languages;
  editorValue: Record<Languages, string>;
};

const initialState: WorkspaceState = {
  currentLanguage: Languages.PYTHON,
  editorValue: { ...defaultPrograms },
};

const WorkspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentLanguage: (state, action: PayloadAction<Languages>) => {
      state.currentLanguage = action.payload;
    },
    setEditorValue: (state, action: PayloadAction<string>) => {
      state.editorValue[state.currentLanguage] = action.payload;
    },
    resetEditorValues: (
      state,
      action: PayloadAction<Languages | undefined>
    ) => {
      const language = action.payload;
      if (language !== undefined) {
        state.editorValue[language] = defaultPrograms[language];
      } else {
        state.editorValue = { ...defaultPrograms };
      }
    },
  },
});

export const WorkspaceActions = WorkspaceSlice.actions;

export default WorkspaceSlice.reducer;
