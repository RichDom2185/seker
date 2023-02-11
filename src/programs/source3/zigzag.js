for (let i = 0; i < 10; i = i + 1) {
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
