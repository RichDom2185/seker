import React from "react";
import AceEditor, { IAceEditorProps } from "react-ace";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "js-slang/dist/editors/ace/theme/source";

const Editor: React.FC<IAceEditorProps> = (props) => {
  return <AceEditor {...props} />;
};

export default Editor;
