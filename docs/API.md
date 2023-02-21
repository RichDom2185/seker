<!-- markdownlint-disable-file header-increment -->
# Source Language Bindings for the SPIKE Prime API

This page documents the available Source language bindings for the SPIKE Prime's internal API. These bindings are available when running programs on the SPIKE Prime using [SEKER](https://github.com/RichDom2185/seker).

**Note:** The language bindings are still under early development so may be updated with breaking changes in the future. This document servers to be as accurate as possible to the [latest deployment](https://richdom2185.github.io/seker/) version of SEKER.

## General Functions

The following functions are availalable:

#### `spike_showImage`

Uses the 5x5 LCD matrix to display a specified _image_. An _image_ is a string that is exactly 29 characters long, in the following format: `XXXXX:XXXXX:XXXXX:XXXXX:XXXXX`, where `X` is the brigtness value of each pixel.

`X` is a value between 0 (off) and 9 (maximum brightness). The sequence of pixel values goes from left to right, row by row, from the topmost row to the bottom. In other words, the 25 pixels start from the top-left, going horizontally, until the bottom-right.

Example:

```javascript
// Shows a stylized number 7
spike_showImage("99999:90099:00990:00900:00900");
```

#### `spike_sleep`

Sleeps (does nothing) for the specified number of seconds.

Example:

```javascript
// Waits for one second before continuing
spike_sleep(1);
```

#### `spike_getTemperature`

Returns the hub's current temperature, in °C.

#### `spike_showText`

Uses the 5x5 LCD to display a string of text, one character at a time.

Example:

```javascript
spike_showText("Hello World!");
```

#### `spike_playSound`

Plays a note with the specified frequency and duration.

Example:

```javascript
// Plays the "A4" note for 0.3 seconds.
const freq = 440; // Hz
const duration = 300; // ms
spike_playSound(freq, duration);
```

## Sensors

There are three different types of sensors that are supported at the moment:

* SPIKE Prime Color Sensor
* SPIKE Prime Distance Sensor
* SPIKE Prime Force Sensor

**Important:** Make sure you only have at most one of each sensor plugged into the SPIKE Prime at all times. Otherwise, the below functions might not target the correct sensor.

#### `spike_colorSensor`

Returns the color sensor that is connected to any of the ports A, B, C, D, E, or F.

Example:

```javascript
// Saves the color sensor into a variable for later use.
const colorSensor = spike_colorSensor();
```

#### `spike_distanceSensor`

Returns the distance sensor that is connected to any of the ports A, B, C, D, E, or F.

Example:

```javascript
// Saves the distance sensor into a variable for later use.
const distanceSensor = spike_distanceSensor();
```

#### `spike_forceSensor`

Returns the force sensor that is connected to any of the ports A, B, C, D, E, or F.

Example:

```javascript
// Saves the force sensor into a variable for later use.
const forceSensor = spike_forceSensor();
```

### Color Sensor

The following functions are supported for the color sensor:

#### `spike_getReflectedLightIntensity`

Gets the reflected light intensity as a number between 0 (no reflected light) and 100 (maximum reflected light intensity).

Example:

```javascript
// Saves reflected light intensity into a variable called `value`.
const colorSensor = spike_colorSensor();
const value = spike_getReflectedLightIntensity(colorSensor);
```

#### `spike_getColor`

Gets the color that is detected by the sensor as a number. The mapping table below describes what the numbers mean. The color value can only take on one of the following values:

|             Color              | Value |
|:------------------------------:|:-----:|
|             Black              |   0   |
| Bright Reddish Violet (Purple) |   1   |
|          (Dark) Blue           |   3   |
|    Medium Azur (Light Blue)    |   4   |
|             Green              |   5   |
|             Yellow             |   7   |
|              Red               |   9   |
|             White              |  10   |

Example:

```javascript
// Checks whether the detected color is red.
const colorSensor = spike_colorSensor();
const value = spike_getColor(colorSensor);
if (value === 9) {
  display("Color is red!");
}
```

### Distance Sensor

The following functions are supported for the distance sensor:

#### `spike_getCentimetres`

### Force Sensor

The following functions are supported for the force sensor:

#### `spike_getTouchStrength`

#### `spike_getIsTouched`

## Motors

Multiple motors can be connected to the SPIKE Prime at once. Simply use the corresponding function to target the correct motor.

#### `spike_motorA`

Returns the motor (either large or medium) that is connected to port A on the hub. Throws an error if the port is not connected to a motor.

Example:

```javascript
const motorA = spike_motorA();
```

#### `spike_motorB`

Returns the motor (either large or medium) that is connected to port B on the hub. Throws an error if the port is not connected to a motor.

Example:

```javascript
const motorB = spike_motorB();
```

#### `spike_motorC`

Returns the motor (either large or medium) that is connected to port C on the hub. Throws an error if the port is not connected to a motor.

Example:

```javascript
const motorC = spike_motorC();
```

#### `spike_motorD`

Returns the motor (either large or medium) that is connected to port D on the hub. Throws an error if the port is not connected to a motor.

Example:

```javascript
const motorD = spike_motorD();
```

#### `spike_motorE`

Returns the motor (either large or medium) that is connected to port E on the hub. Throws an error if the port is not connected to a motor.

Example:

```javascript
const motorE = spike_motorE();
```

#### `spike_motorF`

Returns the motor (either large or medium) that is connected to port F on the hub. Throws an error if the port is not connected to a motor.

Example:

```javascript
const motorF = spike_motorF();
```

### Motor Functions

#### `spike_runForDegrees`

Runs the specified motor for the specified number of degrees of rotation. Degrees can be both positive or negative, which signifies a forward or reverse direction respectively.

Example:

```javascript
// Runs motor A forward for 2 full rotations (720 degrees).
const motorA = spike_motorA();
spike_runForDegrees(motorA, 720);
```
