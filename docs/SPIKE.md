# SPIKE Prime documentation

> For lack of availability of better information online, this document will detail some of the API exploration that was done during while trying to create [Source Language](https://github.com/source-academy/js-slang) wrappers around the SPIKE Prime library. These Source functions are used in [SEKER](https://richdom2185.github.io/seker) to make programming SPIKE Prime hubs using Source possible.

_**Note**: This document serves to document the Python API only. Implementations of the Source wrapper functions will be done in a separate document._

## Introduction

In the rest of this document, the SPIKE Prime hub will be simply reffered to as "hub".

We first connect to the MicroPython REPL running on the hub. On Unix systems:

1. Connect the hub to your computer via USB cable

1. Get the device port address of the hub.

    ```bash
    $ ls /dev/tty* | grep -i usb
    /dev/tty.usbmodem36823XXXXXXXX
    ```

1. Connect to the hub using the terminal.

    ```bash
    screen /dev/tty.usbmodem36823XXXXXXXX
    ```

1. The terminal will start to print a bunch of numbers. Send <kbd>Ctrl</kbd> + <kbd>C</kbd> to bring up the REPL.

1. On the MicroPython REPL, import the `hub` object to access the hub API:

    ```py
    import hub
    ```

## Ports

We use a hacky method to determine the current device that is connected to a specific port.

Running `list(map(len, hub.status()['port'].values()))`, we see that luckily, the length of output values given by each sensor type is unique:

| Peripheral           | Length of Array |
|----------------------|:---------------:|
| Large Angular Motor  |        4        |
| Medium Angular Motor |        4        |
| Color Sensor         |        5        |
| Distance Sensor      |        1        |
| Force Sensor         |        3        |

Thus, we can create some ways to get the connected port of a particular peripheral:

```py
dict(filter(lambda p: len(p[1]) == 5, hub.status()['port'].items()))
```

Alternatively,

```py
# Not actual implementation
def get_color_sensor_port():
    ports = hub.status()['port']
    return list(filter(lambda k: len(ports[k]) == 5, "ABCDEF"))
```

## Sensors

### Color Sensor

The basic kit for the SPIKE Prime came with some colored LEGO bricks. We used that for testing purposes to determine the value

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

Values 2, 6, and 8 do not seem to be used. This is consistent with the [technical specifications of the SPIKE Prime color sensor](https://education.lego.com/v3/assets/blt293eea581807678a/blt62a78c227edef070/5f8801b9a302dc0d859a732b/techspecs_techniccolorsensor.pdf).

### Distance Sensor

[Technical specifications of the SPIKE Prime distance sensor.](https://docs.rs-online.com/faec/A700000007765045.pdf)

### Force Sensor

[Technical specifications of the SPIKE Prime force sensor.](https://education.lego.com/v3/assets/blt293eea581807678a/blt23df304b05e587b2/5f8801ba721f8178f2e5e626/techspecs_technicforcesensor.pdf)
