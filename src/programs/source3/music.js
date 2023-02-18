// Adapted from
// https://projecthub.arduino.cc/slagestee/d947337b-0ff0-4a2d-93c6-8b117ea61d79
const a3f = 208;
const b3f = 233;
const b3 = 247;
const c4 = 261;
const c4s = 277;
const e4f = 311;
const f4 = 349;
const a4f = 415;
const b4f = 466;
const b4 = 493;
const c5 = 523;
const c5s = 554;
const e5f = 622;
const f5 = 698;
const f5s = 740;
const a5f = 831;

const rest = -1;

// Slightly tweaked, this sounds better
const notes = [
  a4f, a4f, b4f, a4f, f5, f5, e5f,
  a4f, a4f, b4f, a4f, e5f, e5f, c5s, c5, b4f,
  b4f, b4f, c5s, b4f, c5s, e5f, c5, b4f, a4f, a4f,
  a4f, e5f, c5s,
  a4f, a4f, b4f, a4f, f5, f5, e5f,
  a4f, a4f, b4f, a4f, a5f, c5, c5s, c5, b4f,
  b4f, b4f, c5s, b4f, c5s, e5f, c5, b4f, a4f, rest, a4f, e5f, c5s, rest
];

const durations = [
  1, 1, 1, 1, 3, 3, 6,
  1, 1, 1, 1, 3, 3, 3, 1, 2,
  1, 1, 1, 1, 3, 3, 3, 1, 2, 2,
  2, 4, 8,
  1, 1, 1, 1, 3, 3, 6,
  1, 1, 1, 1, 3, 3, 3, 1, 2,
  1, 1, 1, 1, 3, 3, 3, 1, 2, 2, 2, 4, 8, 4
];

const lyrics = [
  "N", " ", "G", " ", "G", "Y", "U",
  "N", " ", "G", " ", "L", "Y", "D", " ", " ",
  "N", " ", "G", " ", "R", "A", " ", " ", " ", "A",
  "D", " ", "Y",
  "N", " ", "G", " ", "M", "Y", "C",
  "N", " ", "G", " ", "S", "G", " ", " ", " ",
  "N", " ", "G", " ", "T", "A", "L", " ", " ", " ", "A", "H", "Y", " "
];

for (let i = 0; i < 59; i = i + 1) {
  spike_showText(lyrics[i]);
  spike_playSound(notes[i], durations[i] * 100);
  spike_sleep(durations[i] * 0.12);
}
