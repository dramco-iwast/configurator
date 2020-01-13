import { Injectable } from '@angular/core';
import {Motherboard} from "../../../entity/motherboard/Motherboard";
import {BehaviorSubject, Observable} from "rxjs";
import {MotherboardService} from "../motherboard/motherboard.service";
import {CommandBuilderService} from "../commandBuilder/command-builder.service";
import {CommunicateService} from "../communicate/communicate.service";
import * as SerialPort from 'serialport';
import {GlobalVariableCMD, GlobalVariableNames, GlobalVariableResponse} from "../../../shared/global";

@Injectable({
  providedIn: 'root'
})

export class MotherboardInUseService {
  private motherboard: Motherboard;
  private observableMotherboard: BehaviorSubject<Motherboard>;

  get Motherboard():Observable<Motherboard>{
    return this.observableMotherboard.asObservable();
  }

  private usedSensorId: string;

  setUsedSensorId(sensorId: string){
    console.log('set userid');
    this.usedSensorId = sensorId;
  }

  getUsedSensorId(){
    return this.usedSensorId;
  }

  constructor(private motherboardService: MotherboardService,
              private commandBuilderService: CommandBuilderService,
              private communicateService: CommunicateService){
    this.motherboard = new Motherboard();
    this.motherboard.id = 'none';
    this.observableMotherboard = new BehaviorSubject<Motherboard>(null);
  }

  changeMotherboard(motherboard:Motherboard){
    console.log('motherboard updated');
    this.motherboard = motherboard;
    this.observableMotherboard.next(motherboard);
    this.usedSensorId = 'undefined';
  }

  removeMotherboard(){
    console.log('motherboard removed');
    this.motherboardService.removeMotherboard(this.motherboard.id);
    this.motherboard = new Motherboard();
    this.motherboard.id = 'none';
    this.usedSensorId = 'undefined';
    this.observableMotherboard.next(this.motherboard);
  }

  setValue(metricId: string, ATcmd: string, value:string, expectedResponse: string, notExpectedResponse: string){
    let command = this.commandBuilderService.buildSetCommandSensor(ATcmd, this.usedSensorId, metricId, value);
    console.log('motherboard set values' + command);
    let responseOk = this.commandBuilderService.respondsSuccess(expectedResponse);
    let responseNotOk = this.commandBuilderService.respondsFail(notExpectedResponse);
    return this.communicateService.communicate(command, this.motherboard.serialPort, responseOk, responseNotOk);
  }

  getValues(metricId: string, ATcmd: string, expectedResponse: string, notExpectedResponse: string){
    let command = this.commandBuilderService.buildGetCommandSensor(ATcmd, this.usedSensorId, metricId);
    console.log('motherboard get values' + command);
    let responseOk = this.commandBuilderService.respondsSuccess(expectedResponse);
    let responseNotOk = this.commandBuilderService.respondsFail(notExpectedResponse);
    return this.communicateService.communicate(command, this.motherboard.serialPort, responseOk, responseNotOk);
  }

  close(){
    let command = this.commandBuilderService.buildCommandMotherboard(GlobalVariableCMD.CLOSE);
    let responseOk = this.commandBuilderService.respondsSuccess(GlobalVariableResponse.CLOSE);
    this.removeMotherboard();
    return this.communicateService.communicate(command, this.motherboard.serialPort, responseOk, '');
  }
}
