builtin_microcode.update({
    'spike_showImage': lambda args: hub.display.show(hub.Image(args[0])),
    'spike_sleep': lambda args: time.sleep(args[0]),
    'spike_getTemperature': lambda _: hub.temperature()
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
