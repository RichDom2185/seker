builtin_microcode.update({
    'spike_showImage': lambda args: hub.display.show(hub.Image(args[0])),
    'spike_sleep': lambda args: time.sleep(args[0]),
    'spike_getTemperature': lambda _: hub.temperature(),
    'spike_showText': lambda args:  hub.display.show(args[0]),
    # hub.sound.beep expects int arguments, not float
    'spike_playSound': lambda args: hub.sound.beep(int(args[0]), int(args[1]), hub.sound.SOUND_SIN),
})

# We need to update some stuff; aka run the following lines again.
# The following lines are taken from interpreter_prefix.py
builtin_names = tuple(builtin_microcode.keys())

for b in builtin_names:
    global_frame[b] = {'tag': 'builtin',
                       'sym': b,
                       'arity': builtin_arities[b]
                       if b in builtin_arities
                       else 1
                       }
