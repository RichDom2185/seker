import { decompressFromEncodedURIComponent } from "lz-string";
import { parse } from "query-string";
import { EventHandler, useEffect, useState } from "react";
import AceEditor from "react-ace";
import "./App.css";
import { BAUD_RATE_SPIKE_PRIME, PROGRAM_PLACEHOLDER } from "./utils/constants";

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
          console.log(port.getInfo());
          console.log("Opening port");
          await port.open({ baudRate: BAUD_RATE_SPIKE_PRIME });

          // Listen to data coming from the serial device.
          const reader = port.readable.getReader();

          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              console.log("Done");
              // Allow the serial port to be closed later.
              reader.releaseLock();
              break;
            }
            // value is a Uint8Array.
            console.log(new TextDecoder().decode(value as Uint8Array));
          }
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
