// Requires a force sensor to be plugged into any of the ports on the hub
const sensor = spike_forceSensor();
for (let i = 0; i < 10; i = i + 1) {
  display(spike_getIsTouched(sensor));
  spike_sleep(1);
}
