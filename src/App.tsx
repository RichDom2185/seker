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
import { readUntilPrompt, writeLine } from "./utils/functions";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "js-slang/dist/editors/ace/theme/source";

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

function App() {
  const [program, setProgram] = useState(PROGRAM_PLACEHOLDER);

  useEffect(() => {
    const decodedFragment = parse(location.hash);
    const decodedProgram = decompressFromEncodedURIComponent(
      decodedFragment.prgrm as string
    );
    if (decodedProgram) {
      setProgram(decodedProgram);
    }
  }, []);

  return (
    <div className="App">
      <h2>SEKER: Source–SPIKE Prime Runner</h2>
      <button
        onClick={async () => {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate: BAUD_RATE_SPIKE_PRIME });

          console.log(await readUntilPrompt(port, 2000, true));

          await writeLine(port, KEYBOARD_INTERRUPT);

          console.log(await readUntilPrompt(port, 2000, true));
          await writeLine(port, "");
          await writeLine(port, "import hub");
          await writeLine(port, "hub.display.clear()");
          await writeLine(port, "");
          await writeLine(port, END_OF_TRANSMISSION);
          port.close();
        }}
      >
        Select Device
      </button>
      <p>Source §3 code:</p>
      <AceEditor
        mode="javascript"
        theme="source"
        onChange={setProgram}
        value={program}
      />
    </div>
  );
}

export default App;
