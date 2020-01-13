import { Metric } from "./Metric";

export class Sensor {
  id: string;
  type: string;

  name: string;
  info: {[id: string] : string };
  metrics: {[id: string]: Metric};

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
    this.metrics = {};
    this.info = {};
  }
}
