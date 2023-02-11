from time import sleep

import hub

stat = True
for _ in range(4):
    hub.display.invert(stat)
    sleep(1)
    stat = not stat
