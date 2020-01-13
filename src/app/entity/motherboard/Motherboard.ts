import * as SerialPort from 'serialport';
import { Sensor} from "./Sensor";
import {Metric} from "./Metric";

export class Motherboard {
  serialPort: SerialPort;
  sensors: {[id: string]: Sensor};
  id: string;

  constructor(){
    this.sensors = {};
  }
}
