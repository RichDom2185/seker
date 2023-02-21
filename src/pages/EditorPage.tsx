import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Checkbox,
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
import { parseIntoJsonChunks, parse_into_json } from "../libs/parser";
import {
  BAUD_RATE_SPIKE_PRIME,
  END_OF_TRANSMISSION,
  KEYBOARD_INTERRUPT,
  Languages,
  languageToModeMap,
  PROGRAM_PLACEHOLDER_PYTHON,
  PROGRAM_PLACEHOLDER_SOURCE_THREE,
  RAW_MODE_COMPILE,
  RAW_MODE_ENTER,
  RAW_MODE_EXIT,
  supportedLanguages,
} from "../utils/constants";
import {
  cleanProgram,
  processRawOutput,
  readUntilPrompt,
  runProgram,
  writeLines,
} from "../utils/functions";

import interpreterEvaluatePrelude from "../libs/interpreter_evaluate_prelude.py?raw";
import interpreterPrefix from "../libs/interpreter_prefix.py?raw";
import interpreterPrefix2 from "../libs/interpreter_prefix2.py?raw";
import interpreterSuffix from "../libs/interpreter_suffix.py?raw";
import spikeMicrocode from "../libs/spike_microcode.py?raw";

import sourceThreePrelude01 from "../libs/source3/prelude/01.js?raw";
import sourceThreePrelude02 from "../libs/source3/prelude/02.js?raw";
import sourceThreePrelude03 from "../libs/source3/prelude/03.js?raw";
import sourceThreePrelude04 from "../libs/source3/prelude/04.js?raw";
import sourceThreePrelude05 from "../libs/source3/prelude/05.js?raw";
import sourceThreePrelude06 from "../libs/source3/prelude/06.js?raw";
import sourceThreePrelude07 from "../libs/source3/prelude/07.js?raw";
import sourceThreePrelude08 from "../libs/source3/prelude/08.js?raw";
import sourceThreePrelude09 from "../libs/source3/prelude/09.js?raw";
import sourceThreePrelude10 from "../libs/source3/prelude/10.js?raw";
import sourceThreePrelude11 from "../libs/source3/prelude/11.js?raw";
import sourceThreePrelude12 from "../libs/source3/prelude/12.js?raw";
import sourceThreePrelude13 from "../libs/source3/prelude/13.js?raw";
import sourceThreePrelude14 from "../libs/source3/prelude/14.js?raw";
import sourceThreePrelude15 from "../libs/source3/prelude/15.js?raw";
import sourceThreePrelude16 from "../libs/source3/prelude/16.js?raw";
import sourceThreePrelude17 from "../libs/source3/prelude/17.js?raw";
import sourceThreePrelude18 from "../libs/source3/prelude/18.js?raw";
import sourceThreePrelude19 from "../libs/source3/prelude/19.js?raw";
import sourceThreePrelude20 from "../libs/source3/prelude/20.js?raw";
import sourceThreePrelude21 from "../libs/source3/prelude/21.js?raw";
import sourceThreePrelude22 from "../libs/source3/prelude/22.js?raw";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "js-slang/dist/editors/ace/theme/source";

const languagePlaceholders = {
  [Languages.PYTHON]: PROGRAM_PLACEHOLDER_PYTHON,
  [Languages.SOURCE_THREE]: PROGRAM_PLACEHOLDER_SOURCE_THREE,
};

// TODO: Replace this with improved chunking logic.
const preludes = [
  sourceThreePrelude01,
  sourceThreePrelude02,
  sourceThreePrelude03,
  sourceThreePrelude04,
  sourceThreePrelude05,
  sourceThreePrelude06,
  sourceThreePrelude07,
  sourceThreePrelude08,
  sourceThreePrelude09,
  sourceThreePrelude10,
  sourceThreePrelude11,
  sourceThreePrelude12,
  sourceThreePrelude13,
  sourceThreePrelude14,
  sourceThreePrelude15,
  sourceThreePrelude16,
  sourceThreePrelude17,
  sourceThreePrelude18,
  sourceThreePrelude19,
  sourceThreePrelude20,
  sourceThreePrelude21,
  sourceThreePrelude22,
];

const EditorPage: React.FC = () => {
  const [jsonProgram, setJsonProgram] = useState("");
  const [languageMode, setLanguageMode] = useState(Languages.PYTHON);
  const [program, setProgram] = useState(languagePlaceholders[languageMode]);
  // TODO: Temporary workaround to allow for larger programs
  const [shouldUsePrelude, setShouldUsePrelude] = useState(false);

  // TODO: Memoize using useCallback
  const handleClickRun = async () => {
    if (languageMode === Languages.SOURCE_THREE) {
      try {
        parse_into_json(program);
        setJsonProgram("");
      } catch (e) {
        setJsonProgram("[ERROR] " + e);
        return;
      }
    }

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
        await runProgram(port, cleanProgram(interpreterPrefix2));
        await runProgram(port, cleanProgram(spikeMicrocode));

        if (shouldUsePrelude) {
          // TODO: Remove code duplication
          for (const prelude of preludes) {
            console.log("Sending prelude chunk");
            const parsedPrelude = parse_into_json(prelude);
            // Newlines are automatically added by `writeLines`
            await writeLines(
              port,
              RAW_MODE_ENTER,
              "json_prelude = '''\\",
              ...parsedPrelude.match(/.{1,1000}/g)!.map((s) => s + "\\"),
              "'''",
              RAW_MODE_COMPILE,
              RAW_MODE_EXIT
            );
            await readUntilPrompt(port, 0, (text) => {
              const cleaned = processRawOutput(text);
              if (cleaned) console.log(cleaned);
            });
            console.log("Sending prelude chunk complete");
            await runProgram(port, cleanProgram(interpreterEvaluatePrelude));
          }
        }

        console.log("Sending JSON program");
        // TODO: Refactor
        const chunks = parseIntoJsonChunks(program);
        const parsedProgram = chunks[0];

        // Newlines are automatically added by `writeLines`
        await writeLines(
          port,
          RAW_MODE_ENTER,
          "json_string = '''\\",
          ...parsedProgram.match(/.{1,500}/g)!.map((s) => s + "\\"),
          "'''",
          RAW_MODE_COMPILE,
          RAW_MODE_EXIT
        );
        await readUntilPrompt(port, 0, (text) => {
          const cleaned = processRawOutput(text);
          if (cleaned) console.log(cleaned);
        });
        console.log("Sending JSON program complete");

        // TODO: Refactor
        await writeLines(
          port,
          RAW_MODE_ENTER,
          cleanProgram(interpreterSuffix),
          RAW_MODE_COMPILE,
          ...chunks.slice(1).flatMap((chunk) => [chunk, RAW_MODE_COMPILE]),
          RAW_MODE_EXIT
        );
        await readUntilPrompt(port, 0, (text) => {
          const cleaned = processRawOutput(text);
          if (cleaned) console.log(cleaned);
        });
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
              {languageMode === Languages.SOURCE_THREE && (
                <Checkbox
                  isChecked={shouldUsePrelude}
                  onChange={() => setShouldUsePrelude((oldValue) => !oldValue)}
                >
                  Prelude
                </Checkbox>
              )}
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
