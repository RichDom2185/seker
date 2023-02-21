# SEKER

> _**S**ourc**e**–SPI**KE** Prime **R**unner_

SEKER is an cross-platform, browser-based application to run Python and [Source](https://github.com/source-academy/js-slang) programs on LEGO SPIKE Prime kits. SEKER is also generalizable to other MicroPython-based boards, thus making it accessible for as many students and teachers as possible.

Built using React, SEKER uses the WebSerial API to interface with the SPIKE Prime hub connected via USB. Source programs are serialized into JSON and sent to the hub, where a Python interpreter is running. The interpreter parses the JSON syntax tree and runs the program directly on the hub. Much like [Source Academy](https://sourceacademy.org/), SEKER is backend-less, meaning hosting can be done for no cost.

_**Note:** the WebSerial API is only supported in [Chromium-based browsers, version 89 onwards](https://caniuse.com/web-serial)._

## Features

* Language selector between Python and Source §3
* Sample programs for each language to get started
* Source language bindings for the SPIKE Prime's internal API:
  * Motors
  * Sensors
    * Color Sensor
    * Distance Sensor
    * Force Sensor
  * LCD Display
  * Speakers
* View program output _(coming soon)_
* Advanced features:
  * View the parsed JSON representation (Source §3 mode only)

## Using SEKER

Get started by accessing the [deployment URL](https://richdom2185.github.io/seker/). A simple user guide is provided inside the application.

A full documentation of the Source language bindings will be available soon.
