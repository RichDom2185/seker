import { useColorMode } from "@chakra-ui/react";
import React from "react";
import AceEditor, { IAceEditorProps } from "react-ace";
import { useTypedSelector } from "../../redux/hooks";
import { languageToModeMap } from "../../utils/constants";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

type Props = Omit<IAceEditorProps, "mode" | "theme" | "fontSize" | "width">;

const Editor: React.FC<Props> = (props) => {
  const languageMode = useTypedSelector(
    (state) => state.workspace.currentLanguage
  );
  const { colorMode } = useColorMode();
  return (
    <AceEditor
      mode={languageToModeMap[languageMode]}
      theme={colorMode === "dark" ? "dracula" : "tomorrow_night_eighties"}
      fontSize={15}
      width="100%"
      {...props}
    />
  );
};

export default Editor;
