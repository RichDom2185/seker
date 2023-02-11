import SampleProgramSidebar from "./components/sidebar/SampleProgramSidebar";
import { decompressFromEncodedURIComponent } from "lz-string";
import { parse } from "query-string";
import { EventHandler, useEffect, useState } from "react";
import AceEditor from "react-ace";
import "./App.css";
import {
  BAUD_RATE_SPIKE_PRIME,
  END_OF_TRANSMISSION,
  KEYBOARD_INTERRUPT,
  Languages,
  languageToModeMap,
  PROGRAM_PLACEHOLDER_PYTHON,
  PROGRAM_PLACEHOLDER_SOURCE_THREE,
  supportedLanguages,
} from "./utils/constants";
import { readUntilPrompt, runProgram, writeLines } from "./utils/functions";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "js-slang/dist/editors/ace/theme/source";
import { parse_into_json } from "./libs/parser";

/*
 * References:
 * https://github.com/microsoft/pxt-ev3/blob/bef4ebac43414beb900f04812f7c5101a192c22e/editor/deploy.ts
 * https://wicg.github.io/serial/
 */
declare type SerialOptions = any;
declare type SerialPortInfo = any;
declare class SerialPort {
  open(options?: SerialOptions): Promise<void>;
  close(): void;
  readonly readable: any;
  readonly writable: any;
  getInfo(): SerialPortInfo;
}
declare interface Serial extends EventTarget {
  onconnect: EventHandler<any>;
  ondisconnect: EventHandler<any>;
  getPorts(): Promise<SerialPort[]>;
  requestPort(options?: any): Promise<SerialPort>;
}

declare global {
  interface Navigator {
    readonly serial: Serial;
  }
}

const languagePlaceholders = {
  [Languages.PYTHON]: PROGRAM_PLACEHOLDER_PYTHON,
  [Languages.SOURCE_THREE]: PROGRAM_PLACEHOLDER_SOURCE_THREE,
};

function App() {
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

  return (
    <div className="App">
      <h2>SEKER: Source–SPIKE Prime Runner</h2>
      {languageMode === Languages.SOURCE_THREE && (
        <p>
          <em>Support for {Languages.SOURCE_THREE} Programs is coming soon!</em>
        </p>
      )}
      <select
        name="languageMode"
        id="languagemode"
        value={languageMode}
        onChange={(e) => setLanguageMode(e.target.value as Languages)}
      >
        {supportedLanguages.map((language) => (
          <option value={language}>{language}</option>
        ))}
      </select>
      <button
        onClick={handleClickRun}
        // TODO: Support running Source Programs
        disabled={languageMode === Languages.SOURCE_THREE}
      >
        Run on Device
      </button>
      <AceEditor
        name="editor"
        mode={languageToModeMap[languageMode]}
        theme="source"
        width="100%"
        onChange={setProgram}
        value={program}
      />
      <button
        onClick={() => {
          try {
            setJsonProgram(parse_into_json(program));
          } catch (e) {
            setJsonProgram("[ERROR] " + e);
          }
        }}
      >
        Parse into JSON
      </button>
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
    </div>
  );
}

export default App;
