/*
 * References:
 * https://github.com/microsoft/pxt-ev3/blob/bef4ebac43414beb900f04812f7c5101a192c22e/editor/deploy.ts
 * https://wicg.github.io/serial/
 */
declare type SerialOptions = any;

declare type SerialPortInfo = any;

declare class SerialPort {
  open(options?: SerialOptions): Promise<void>;
  close(): void;
  readonly readable: any;
  readonly writable: any;
  getInfo(): SerialPortInfo;
}

declare interface Serial extends EventTarget {
  onconnect: React.EventHandler<any>;
  ondisconnect: React.EventHandler<any>;
  getPorts(): Promise<SerialPort[]>;
  requestPort(options?: any): Promise<SerialPort>;
}
