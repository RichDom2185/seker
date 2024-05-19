import { Select } from "@chakra-ui/react";
import React from "react";
import { useTypedDispatch, useTypedSelector } from "../../redux/hooks";
import { WorkspaceActions } from "../../redux/reducers/workspace";
import { Languages, supportedLanguages } from "../../utils/constants";

const { setCurrentLanguage } = WorkspaceActions;

const LanguageSelector: React.FC = () => {
  const lang = useTypedSelector((state) => state.workspace.currentLanguage);
  const dispatch = useTypedDispatch();
  return (
    <Select
      size="sm"
      variant="filled"
      width="fit-content"
      name="languageMode"
      id="languagemode"
      value={lang}
      onChange={(e) =>
        dispatch(setCurrentLanguage(e.target.value as Languages))
      }
    >
      {supportedLanguages.map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </Select>
  );
};

export default LanguageSelector;
