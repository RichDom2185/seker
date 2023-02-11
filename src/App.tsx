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
  PROGRAM_PLACEHOLDER,
  supportedLanguages,
} from "./utils/constants";
import { readUntilPrompt, runProgram, writeLines } from "./utils/functions";

import sampleProgramBlinkLoop from "./programs/python/blink_loop.py?raw";
import sampleProgramImagePixel from "./programs/python/image_pixel.py?raw";

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

const samplePythonPrograms: readonly string[] = [
  sampleProgramImagePixel,
  sampleProgramBlinkLoop,
];

function App() {
  const [sourceProgram, setSourceProgram] = useState(PROGRAM_PLACEHOLDER);
  const [jsonProgram, setJsonProgram] = useState("");
  const [languageMode, setLanguageMode] = useState(Languages.PYTHON);
  const [program, setProgram] = useState(samplePythonPrograms[0]);

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
      setSourceProgram(decodedProgram);
    }
  }, []);

  return (
    <div className="App">
      <h2>SEKER: Source–SPIKE Prime Runner</h2>
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
      <button onClick={handleClickRun}>Run on Device</button>
      <p>{languageMode} code:</p>
      <AceEditor
        name="editor"
        mode={languageToModeMap[languageMode]}
        theme="source"
        width="100%"
        onChange={setProgram}
        value={program}
      />
      <hr style={{ marginBlock: "1.5em" }} />
      <p>
        <strong>NOTE:</strong> The following section is to demonstrate the
        Source-to-JSON parser. Running of Source programs directly on the SPIKE
        Prime is not available yet.
      </p>
      <button
        onClick={() => {
          try {
            setJsonProgram(parse_into_json(sourceProgram));
          } catch (e) {
            setJsonProgram("[ERROR] " + e);
          }
        }}
      >
        Parse into JSON
      </button>
      <p>Source §3 code:</p>
      <AceEditor
        name="sourceEditor"
        mode="javascript"
        theme="source"
        width="100%"
        onChange={setSourceProgram}
        value={sourceProgram}
      />
      {jsonProgram && (
        <p>
          JSON Code:
          <br />
          {jsonProgram}
        </p>
      )}
    </div>
  );
}

export default App;
