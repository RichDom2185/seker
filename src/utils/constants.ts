import AceEditor from "react-ace";

export const BAUD_RATE_SPIKE_PRIME = 115200;
export const KEYBOARD_INTERRUPT = "\x03";
export const END_OF_TRANSMISSION = "\x04";

export const PROGRAM_PLACEHOLDER_SOURCE_THREE =
  "// Write your Source §3 program here!";
export const PROGRAM_PLACEHOLDER_PYTHON = "# Write your Python program here!";

// Reference: https://docs.micropython.org/en/latest/reference/repl.html#paste-mode
export const PASTE_MODE_ENTER = "\x05";
export const PASTE_MODE_EXIT = "\x04";
export const PASTE_MODE_CANCEL = "\x03";

// Reference: https://docs.micropython.org/en/latest/reference/repl.html#raw-mode-and-raw-paste-mode
export const RAW_MODE_ENTER = "\x01";
export const RAW_MODE_COMPILE = "\x04";
export const RAW_MODE_EXIT = "\x02";

export enum Languages {
  SOURCE_THREE_INTERPRETER = "Source §3 (Legacy)",
  PYTHON = "Python",
}

export const supportedLanguages = [
  Languages.PYTHON,
  Languages.SOURCE_THREE_INTERPRETER,
] as const satisfies readonly Languages[];

export const languageToModeMap = Object.freeze({
  [Languages.PYTHON]: "python",
  [Languages.SOURCE_THREE_INTERPRETER]: "javascript",
}) satisfies {
  [l in Languages]: React.ComponentProps<typeof AceEditor>["mode"];
};
