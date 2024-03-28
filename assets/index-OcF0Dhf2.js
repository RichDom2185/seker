const e=`// SEKER API Tour

// Shows the below text on the 5x5 display, one character at a time
spike_showText("Hello from SPIKE Prime!");
`,n=`// Requires a motor to be plugged into Port A on the hub
const motor = spike_motorA();
const rotationsToDegrees = rot => rot * 360;

let isReverse = false;
const rotations = 2;

for (let i = 0; i < 4; i = i + 1) {
  spike_runForDegrees(motor,
                      rotationsToDegrees(isReverse ? -rotations : rotations));
  isReverse = !isReverse;
}
`,s=`// Adapted from
// https://projecthub.arduino.cc/slagestee/d947337b-0ff0-4a2d-93c6-8b117ea61d79
const a4f = 415;
const b4f = 466;
const c5 = 523;
const c5s = 554;
const e5f = 622;
const f5 = 698;

// Slightly tweaked, this sounds better
const notes = [
  a4f, a4f, b4f, a4f, f5, f5, e5f,
  a4f, a4f, b4f, a4f, e5f, e5f, c5s, c5, b4f,
  b4f, b4f, c5s, b4f, c5s, e5f, c5, b4f, a4f, a4f,
  a4f, e5f, c5s
];

const durations = [
  1, 1, 1, 1, 3, 3, 6,
  1, 1, 1, 1, 3, 3, 3, 1, 2,
  1, 1, 1, 1, 3, 3, 3, 1, 2, 2,
  2, 4, 8
];

const lyrics = [
  "N", " ", "G", " ", "G", "Y", "U",
  "N", " ", "G", " ", "L", "Y", "D", " ", " ",
  "N", " ", "G", " ", "R", "A", " ", " ", " ", "A",
  "D", " ", "Y"
];

for (let i = 0; i < 29; i = i + 1) {
  spike_showText(lyrics[i]);
  spike_playSound(notes[i], durations[i] * 100);
  spike_sleep(durations[i] * 0.12);
}
`,o=`// Requires a force sensor to be plugged into any of the ports on the hub
const sensor = spike_forceSensor();
for (let i = 0; i < 10; i = i + 1) {
  display(spike_getIsTouched(sensor));
  spike_sleep(1);
}
`,t=`for (let i = 0; i < 10; i = i + 1) {
  spike_showImage("00099:00990:09900:99000:09900");
  spike_sleep(0.2);
  spike_showImage("00990:09900:99000:09900:00990");
  spike_sleep(0.2);
  spike_showImage("09900:99000:09900:00990:00099");
  spike_sleep(0.2);
  spike_showImage("99000:09900:00990:00099:00990");
  spike_sleep(0.2);
  spike_showImage("09900:00990:00099:00990:09900");
  spike_sleep(0.2);
  spike_showImage("00990:00099:00990:09900:99000");
  spike_sleep(0.2);
}
`,i=[e,n,s,o,t];export{i as sampleSourceThreePrograms};
