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
  handleIncomingText: (text: string) => void = () => {}
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
    buffer += text;
    const lines = buffer.split("\n");
    // Handle all complete lines
    for (const line of lines.slice(0, lines.length)) {
      handleIncomingText(line);
    }
    buffer = lines[lines.length - 1]; // Keep last line only
    if (buffer.substring(0, 4) == ">>> " || done) {
      if (maxWaitTime) {
        clearTimeout(handlerId);
      }
      handleIncomingText(buffer);
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

    const chunkSize = 100;
    // console.log("Sending program...");
    for (let i = 0; i < writeData.length; i += chunkSize) {
      // console.log(`Writing chunk at offset ${i}`);
      const chunk = writeData.slice(i, i + chunkSize);
      await writer.write(chunk);

      // Sleep needed to allow the SPIKE to catch up
      // with the rate of data transfer.
      await sleep(10);
    }
    // console.log("Sending complete!");
  }
  // Allow the serial port to be closed later.
  writer.releaseLock();
};

/**
 * Cleans up raw serial output, only indicating actual messages.
 * @param text The raw output from the serial interface to be cleaned.
 * @returns The cleaned output, or undefined if the input is to be ignored.
 */
const processRawOutput = (text: string) => {
  let cleaned = text.trim();

  // Ignore prompts
  const prompts = [">>>", ">OK", ">"]; // Ordering is important
  for (const prompt of prompts) {
    if (cleaned.startsWith(prompt)) {
      cleaned = cleaned.substring(prompt.length).trim();
    }
  }

  // Remove raw mode prompts
  const rawModeInfo = "raw REPL; CTRL-B to exit";
  if (cleaned.startsWith(rawModeInfo)) {
    cleaned = cleaned.substring(rawModeInfo.length).trim();
  }

  // Don't need to handle empty output
  if (!cleaned) return;

  return cleaned;
};

export const runProgram = async (port: SerialPort, program: string) => {
  console.log("Sending program chunk...");
  await writeLines(
    port,
    RAW_MODE_ENTER,
    program,
    RAW_MODE_COMPILE,
    RAW_MODE_EXIT
  );
  await readUntilPrompt(port, 0, (text) => {
    const cleaned = processRawOutput(text);
    if (cleaned) console.log(cleaned);
  });
  console.log("Sending chunk complete...");
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Removes comments and extraneous newlines from a program
 * string, according to Python syntax.
 * @param program The Python program as a string
 * @returns The cleaned string
 */
export const cleanProgram = (program: string) => {
  return (
    program
      // FIXME: Edge cases
      .replaceAll(/(^#|\s#) ?.*$/gm, "")
      .replaceAll(/\n\n\n+/gm, "\n\n")
  );
};
