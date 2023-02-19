import hub
from spike import Motor

builtin_microcode.update({
    'spike_showImage': lambda args: hub.display.show(hub.Image(args[0])),
    'spike_sleep': lambda args: time.sleep(args[0]),
    'spike_getTemperature': lambda _: hub.temperature(),
    'spike_showText': lambda args:  hub.display.show(args[0]),
    # `hub.sound.beep` expects int arguments, not float
    'spike_playSound': lambda args: hub.sound.beep(int(args[0]), int(args[1]), hub.sound.SOUND_SIN),

    # We expect students to only have one of each sensor (as it comes from the base kit).
    'spike_colorSensor': lambda _: getattr(hub.port, list(filter(lambda k: len(hub.status()['port'][k]) == 5, 'ABCDEF'))[0]).device,
    'spike_distanceSensor': lambda _: getattr(hub.port, list(filter(lambda k: len(hub.status()['port'][k]) == 1, 'ABCDEF'))[0]).device,
    'spike_forceSensor': lambda _: getattr(hub.port, list(filter(lambda k: len(hub.status()['port'][k]) == 3, 'ABCDEF'))[0]).device,
    # Color sensor
    'spike_getReflectedLightIntensity': lambda args: args[0].get()[0],
    'spike_getColor': lambda args: args[0].get()[1],
    # Force sensor
    'spike_getTouchStrength': lambda args: args[0].get()[0],
    'spike_getIsTouched': lambda args: args[0].get()[1] == 1,
    # Distance sensor
    'spike_getCentimetres': lambda args: args[0].get()[0] or float('inf'),

    # For motors, we unfortunately have to use a more declarative syntax, specifying the port manually
    'spike_motorA': lambda _: Motor('A'),
    'spike_motorB': lambda _: Motor('B'),
    'spike_motorC': lambda _: Motor('C'),
    'spike_motorD': lambda _: Motor('D'),
    'spike_motorE': lambda _: Motor('E'),
    'spike_motorF': lambda _: Motor('F'),
    'spike_runForDegrees': lambda args: args[0].run_for_degrees(int(args[1])),
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
