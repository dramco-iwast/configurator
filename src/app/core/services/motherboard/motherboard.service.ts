import { Injectable } from '@angular/core';
import {Motherboard} from "../../../entity/motherboard/Motherboard";
import {BehaviorSubject, Observable, ReplaySubject, Subject} from "rxjs";
import {SerialportService} from "../serialport/serialport.service";

@Injectable({
  providedIn: 'root'
})
export class MotherboardService {
  private allMotherboards: {[id: string] : Motherboard};
  private _observableListMotherboards: Subject<{[id: string] : Motherboard}> = new ReplaySubject(1);

  constructor(){
    this.allMotherboards = {};
  }

  getAllmotherboards(){
    return this._observableListMotherboards.asObservable();
  }

  addMotherboard(motherboard: Motherboard){
    console.log('moederbord toegevoed');
    if(!(motherboard.id in this.allMotherboards)){
      this.allMotherboards[motherboard.id] = motherboard;
      this._observableListMotherboards.next(this.allMotherboards);
    }
  }

  removeMotherboard(id: string){
    console.log('moederbord verwijdert met id' + id);
    delete this.allMotherboards[id];
    this._observableListMotherboards.next(this.allMotherboards);
  }

  getMotherboardById(id: string){
    return this.allMotherboards[id];
  }
}
