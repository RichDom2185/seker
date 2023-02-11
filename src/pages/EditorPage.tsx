import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { decompressFromEncodedURIComponent } from "lz-string";
import { parse } from "query-string";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import SampleProgramSidebar from "../components/sidebar/SampleProgramSidebar";
import { parse_into_json } from "../libs/parser";
import {
  BAUD_RATE_SPIKE_PRIME,
  END_OF_TRANSMISSION,
  KEYBOARD_INTERRUPT,
  Languages,
  languageToModeMap,
  PROGRAM_PLACEHOLDER_PYTHON,
  PROGRAM_PLACEHOLDER_SOURCE_THREE,
  supportedLanguages,
} from "../utils/constants";
import { readUntilPrompt, runProgram, writeLines } from "../utils/functions";
import UserGuide from "./UserGuide";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "js-slang/dist/editors/ace/theme/source";

const languagePlaceholders = {
  [Languages.PYTHON]: PROGRAM_PLACEHOLDER_PYTHON,
  [Languages.SOURCE_THREE]: PROGRAM_PLACEHOLDER_SOURCE_THREE,
};

const EditorPage: React.FC = () => {
  const [jsonProgram, setJsonProgram] = useState("");
  const [languageMode, setLanguageMode] = useState(Languages.PYTHON);
  const [program, setProgram] = useState(languagePlaceholders[languageMode]);

  // TODO: Memoize using useCallback
  const handleClickRun = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: BAUD_RATE_SPIKE_PRIME });

    await writeLines(port, KEYBOARD_INTERRUPT);

    await readUntilPrompt(port, 2000);
    await runProgram(port, program);

    // Soft reboot
    await writeLines(port, END_OF_TRANSMISSION);
    port.close();
  };

  // TODO: Memoize using useCallback
  const handleParseJson = () => {
    try {
      setJsonProgram(parse_into_json(program));
    } catch (e) {
      setJsonProgram("[ERROR] " + e);
    }
  };

  useEffect(() => {
    const decodedFragment = parse(location.hash);
    const decodedProgram = decompressFromEncodedURIComponent(
      decodedFragment.prgrm as string
    );
    if (decodedProgram) {
      setLanguageMode(Languages.SOURCE_THREE);
      setProgram(decodedProgram);
    }
  }, []);

  useEffect(() => {
    setProgram(languagePlaceholders[languageMode]);
    setJsonProgram("");
  }, [languageMode, setProgram]);

  return (
    <Box className="App">
      <Heading>SEKER: Source–SPIKE Prime Runner</Heading>
      <UserGuide />
      {languageMode === Languages.SOURCE_THREE && (
        <Text fontStyle="italic" color="red">
          Full support for {Languages.SOURCE_THREE} Programs is coming soon!
        </Text>
      )}
      <HStack>
        <Text fontWeight="bold">Select language mode:</Text>
        <Select
          size="sm"
          variant="filled"
          width="fit-content"
          name="languageMode"
          id="languagemode"
          value={languageMode}
          onChange={(e) => setLanguageMode(e.target.value as Languages)}
        >
          {supportedLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </Select>
        <Spacer />
        <ButtonGroup size="sm">
          <Button
            onClick={handleClickRun}
            // TODO: Support running Source Programs
            isDisabled={languageMode === Languages.SOURCE_THREE}
          >
            Run on Device
          </Button>
          {languageMode === Languages.SOURCE_THREE && (
            <Button onClick={handleParseJson}>Parse into JSON</Button>
          )}
        </ButtonGroup>
      </HStack>
      <AceEditor
        name="editor"
        mode={languageToModeMap[languageMode]}
        theme="source"
        width="100%"
        onChange={setProgram}
        value={program}
        wrapEnabled
      />
      {jsonProgram && (
        <p>
          JSON Code:
          <br />
          {jsonProgram}
        </p>
      )}
      <hr style={{ marginBlock: "1.5em" }} />
      <SampleProgramSidebar
        languageMode={languageMode}
        setProgramState={setProgram}
      />
    </Box>
  );
};

export default EditorPage;
