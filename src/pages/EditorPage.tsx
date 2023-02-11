import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Code,
  GridItem,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { decompressFromEncodedURIComponent } from "lz-string";
import { parse } from "query-string";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import UserGuide from "../components/modals/UserGuide";
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
import {
  cleanProgram,
  readUntilPrompt,
  runProgram,
  writeLines,
} from "../utils/functions";

import interpreterPrefix from "../libs/interpreter_prefix.py?raw";
import interpreterSuffix from "../libs/interpreter_suffix.py?raw";
import spikeMicrocode from "../libs/spike_microcode.py?raw";

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
    switch (languageMode) {
      case Languages.PYTHON:
        await runProgram(port, cleanProgram(program));
        break;
      case Languages.SOURCE_THREE:
        // We split the program into chunks to maximise the amount of program space we can have.
        await runProgram(port, cleanProgram(interpreterPrefix));
        await runProgram(port, cleanProgram(spikeMicrocode));
        await runProgram(port, `json_string = '${parse_into_json(program)}'\n`);
        await runProgram(port, cleanProgram(interpreterSuffix));
        break;
    }

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
      <SimpleGrid
        columns={{ sm: 1, lg: 3 }}
        spacingX={{ sm: 0, lg: 8 }}
        spacingY={8}
      >
        <GridItem colSpan={2}>
          <Stack>
            <Heading>SEKER: Source–SPIKE Prime Runner</Heading>
            <UserGuide />
            {languageMode === Languages.SOURCE_THREE && (
              <Text fontStyle="italic" color="orange.500">
                Note: Support for {Languages.SOURCE_THREE} Programs is in beta!
              </Text>
            )}
            {jsonProgram && (
              <Card>
                <CardBody>
                  <Text>JSON Code:</Text>
                  <Box overflowX="scroll">
                    <Code display="block" whiteSpace="pre" width="max-content">
                      {jsonProgram}
                    </Code>
                  </Box>
                </CardBody>
              </Card>
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
                <Button onClick={handleClickRun}>Run on Device</Button>
                {languageMode === Languages.SOURCE_THREE && (
                  <Button onClick={handleParseJson}>Parse into JSON</Button>
                )}
              </ButtonGroup>
            </HStack>
            <Box borderRadius={6} overflow="clip">
              <AceEditor
                name="editor"
                mode={languageToModeMap[languageMode]}
                theme="source"
                width="100%"
                onChange={setProgram}
                value={program}
                wrapEnabled
              />
            </Box>
          </Stack>
        </GridItem>
        <GridItem>
          <SampleProgramSidebar
            languageMode={languageMode}
            setProgramState={setProgram}
          />
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default EditorPage;
