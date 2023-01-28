export const BAUD_RATE_SPIKE_PRIME = 115200;
export const KEYBOARD_INTERRUPT = "\x03";
export const END_OF_TRANSMISSION = "\x04";

export const PROGRAM_PLACEHOLDER = "// Write your Source §3 program here!";

// Reference: https://docs.micropython.org/en/latest/reference/repl.html#paste-mode
export const PASTE_MODE_ENTER = "\x05";
export const PASTE_MODE_EXIT = "\x04";
export const PASTE_MODE_CANCEL = "\x03";

// Reference: https://docs.micropython.org/en/latest/reference/repl.html#raw-mode-and-raw-paste-mode
export const RAW_MODE_ENTER = "\x01";
export const RAW_MODE_COMPILE = "\x04";
export const RAW_MODE_EXIT = "\x02";
