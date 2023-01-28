import { decompressFromEncodedURIComponent } from "lz-string";
import { parse } from "query-string";
import { EventHandler, useEffect, useState } from "react";
import AceEditor from "react-ace";
import "./App.css";
import {
  BAUD_RATE_SPIKE_PRIME,
  END_OF_TRANSMISSION,
  KEYBOARD_INTERRUPT,
  PROGRAM_PLACEHOLDER,
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

const samplePythonPrograms: readonly string[] = [
  `from spike import PrimeHub
  
hub = PrimeHub()
hub.light_matrix.off()
hub.light_matrix.set_pixel(2, 2, 80)
hub.light_matrix.set_pixel(3, 3, 80)
hub.light_matrix.set_pixel(2, 3, 80)
hub.light_matrix.set_pixel(3, 2, 80)
hub.light_matrix.set_pixel(4, 4, 80)
hub.light_matrix.set_pixel(0, 0, 80)
`,

  `import hub

from time import sleep

stat = True
for _ in range(4):
    hub.display.invert(stat)
    sleep(1)
    stat = not stat
`,
];

function App() {
  const [sourceProgram, setSourceProgram] = useState(PROGRAM_PLACEHOLDER);
  const [jsonProgram, setJsonProgram] = useState("");
  const [pythonProgram, setPythonProgram] = useState(
    samplePythonPrograms.at(
      Math.floor(Math.random() * samplePythonPrograms.length)
    )!
  );

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
      <button
        onClick={async () => {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate: BAUD_RATE_SPIKE_PRIME });

          await writeLines(port, KEYBOARD_INTERRUPT);

          console.log(await readUntilPrompt(port, 2000, true));
          await runProgram(port, pythonProgram);
          console.log("Run complete!");

          // Soft reboot
          await writeLines(port, END_OF_TRANSMISSION);
          port.close();
        }}
      >
        Run on Device
      </button>
      <p>Python code:</p>
      <AceEditor
        name="pythonEditor"
        mode="python"
        theme="source"
        width="100%"
        onChange={setPythonProgram}
        value={pythonProgram}
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
