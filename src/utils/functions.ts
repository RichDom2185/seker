import { RAW_MODE_COMPILE, RAW_MODE_ENTER, RAW_MODE_EXIT } from "./constants";

// FIXME: Fix `any` type
type SerialPort = any;

/*
 * References:
 * https://fidisys.com/blog/serial-port-devices/
 * https://github.com/nutki/spike-tools/blob/master/cp.py
 */
export const readUntilPrompt = async (
  serialPort: SerialPort,
  maxWaitTime: number = 0,
  shouldPrintMessage: boolean = false
) => {
  const reader = serialPort.readable.getReader();
  const handlerId =
    maxWaitTime &&
    setTimeout(() => {
      reader.releaseLock();
      serialPort.close();
      throw new Error("Timed Out.");
    }, maxWaitTime);
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    const text = new TextDecoder().decode(value as Uint8Array);
    if (shouldPrintMessage) {
      console.log(text);
    }
    buffer += text;
    const lines = buffer.split("\n");
    buffer = lines[lines.length - 1]; // keep last line only
    if (buffer.substring(0, 4) == ">>> " || done) {
      if (maxWaitTime) {
        clearTimeout(handlerId);
      }
      // Allow the serial port to be closed later.
      reader.releaseLock();
      return done;
    }
  }
};

export const writeLines = async (
  serialPort: SerialPort,
  ...message: string[]
) => {
  const writer = serialPort.writable.getWriter();
  for (const line of message) {
    const writeData = new TextEncoder().encode(line + "\n");
    await writer.write(writeData);
  }
  // Allow the serial port to be closed later.
  writer.releaseLock();
};

export const runProgram = async (port: SerialPort, program: string) => {
  await writeLines(
    port,
    RAW_MODE_ENTER,
    program,
    RAW_MODE_COMPILE,
    RAW_MODE_EXIT
  );
  await readUntilPrompt(port);
  console.log("Program complete!");
};
