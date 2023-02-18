// Requires a motor to be plugged into Port A on the hub
const motor = spike_motorA();
const rotationsToDegrees = rot => rot * 360;

let isReverse = false;
const rotations = 2;

for (let i = 0; i < 4; i = i + 1) {
  spike_runForDegrees(motor,
                      rotationsToDegrees(isReverse ? -rotations : rotations));
  isReverse = !isReverse;
}
