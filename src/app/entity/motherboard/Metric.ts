export class Metric {
  id: string;

  unit: string;
  quantity: {[id: string] : string };
  info: {[id: string] : string };
  config: [];
  constructor(id: string){
    this.id = id;
    this.quantity = {};
    this.info = {};
    this.config = [];
  }
}
