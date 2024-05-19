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
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import Editor from "../components/editor/Editor";
import UserGuide from "../components/modals/UserGuide";
import SampleProgramSidebar from "../components/sidebar/SampleProgramSidebar";
import { parse_into_json, parseIntoJsonChunks } from "../libs/parser";
import { useTypedDispatch, useTypedSelector } from "../redux/hooks";
import { WorkspaceActions } from "../redux/reducers/workspace";
import {
  BAUD_RATE_SPIKE_PRIME,
  END_OF_TRANSMISSION,
  KEYBOARD_INTERRUPT,
  Languages,
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

const getInterpreterLib = async () =>
  (await import("../libs/interpreter")).default;
const getSourceThreePrelude = async () =>
  (await import("../libs/source3/prelude")).sourceThreePrelude;

const languagePlaceholders = {
  [Languages.PYTHON]: PROGRAM_PLACEHOLDER_PYTHON,
  [Languages.SOURCE_THREE_INTERPRETER]: PROGRAM_PLACEHOLDER_SOURCE_THREE,
};

const EditorPage: React.FC = () => {
  const [jsonProgram, setJsonProgram] = useState("");

  const dispatch = useTypedDispatch();
  const languageMode = useTypedSelector(
    (state) => state.workspace.currentLanguage
  );
  const setLanguageMode = useCallback(
    (language: Languages) =>
      dispatch(WorkspaceActions.setCurrentLanguage(language)),
    [dispatch]
  );

  const [program, setProgram] = useState(languagePlaceholders[languageMode]);
  // TODO: Temporary workaround to allow for larger programs
  const [shouldUsePrelude, setShouldUsePrelude] = useState(false);

  // TODO: Replace this with improved chunking logic.
  const [preludes, setPreludes] =
    useState<Awaited<ReturnType<typeof getSourceThreePrelude>>>();
  const [interpreter, setInterpreter] =
    useState<Awaited<ReturnType<typeof getInterpreterLib>>>();

  useEffect(() => {
    if (preludes) return;
    if (shouldUsePrelude) {
      getSourceThreePrelude().then(setPreludes);
    }
  }, [shouldUsePrelude]);

  useEffect(() => {
    if (interpreter) return;
    if (languageMode === Languages.SOURCE_THREE_INTERPRETER) {
      getInterpreterLib().then(setInterpreter);
    }
  }, [languageMode]);

  // TODO: Memoize using useCallback
  const handleClickRun = async () => {
    if (languageMode === Languages.SOURCE_THREE_INTERPRETER) {
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
      case Languages.SOURCE_THREE_INTERPRETER:
        if (!interpreter) {
          throw new Error("Interpreter not loaded");
        }
        // We split the program into chunks to maximise the amount of program space we can have.
        await runProgram(port, cleanProgram(interpreter.prefix));
        await runProgram(port, cleanProgram(interpreter.prefix2));
        await runProgram(port, cleanProgram(interpreter.spikeMicrocode));

        if (shouldUsePrelude) {
          if (!preludes) {
            throw new Error("Preludes not loaded");
          }
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
            await runProgram(port, cleanProgram(interpreter.evaluatePrelude));
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
          cleanProgram(interpreter.suffix),
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
    const decodedFragment = qs.parse(location.hash);
    const decodedProgram = decompressFromEncodedURIComponent(
      decodedFragment.prgrm as string
    );
    if (decodedProgram) {
      setLanguageMode(Languages.SOURCE_THREE_INTERPRETER);
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
            {languageMode === Languages.SOURCE_THREE_INTERPRETER && (
              <Text fontStyle="italic" color="orange.500">
                Note: Support for {Languages.SOURCE_THREE_INTERPRETER} Programs
                is in beta!
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
              {languageMode === Languages.SOURCE_THREE_INTERPRETER && (
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
                {languageMode === Languages.SOURCE_THREE_INTERPRETER && (
                  <Button onClick={handleParseJson}>Parse into JSON</Button>
                )}
              </ButtonGroup>
            </HStack>
            <Box borderRadius={6} overflow="clip">
              <Editor
                name="editor"
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
