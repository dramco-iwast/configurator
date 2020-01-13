import {Injectable, OnInit} from '@angular/core';
import {FileService} from "../file/file.service";

@Injectable({
  providedIn: 'root'
})
export class CommandBuilderService {
  private nextLine = '\n';

  private subschribeATCmd;
  private ATCmds;
  private ATResponds;
  constructor(private fileService: FileService) {
    this.subschribeATCmd = this.fileService.observableListAtCommands.subscribe(commands => {
      console.log('commandbuilder atcommandsupdated');
      this.ATCmds = commands;
    });
    this.fileService.observableListAtResponds.subscribe(responds =>{
      this.ATResponds = responds;
    })
  }

  buildSetCommandSensor (ATCmd: string, sensorId: string, metricId: string, value:string){
    if(ATCmd in this.ATCmds){
      let sensorIdHex = parseInt(sensorId, 16);
      let metricIdHex = parseInt(metricId, 16);
      let command = this.ATCmds[ATCmd] + sensorIdHex + " " + metricIdHex + " " + value + this.nextLine;
      console.log(command);
      return command;
    }else{
      console.log('wrong cmd');
    }
  }

  buildGetCommandSensor(ATCmd: string, sensorId: string, metricId: string){
    if(ATCmd in this.ATCmds){
      let sensorIdHex = parseInt(sensorId).toString(16);
      let metricIdHex = parseInt(metricId).toString(16);

      if(sensorIdHex.length === 1){
        sensorIdHex = "0" + sensorIdHex;
      }
      if(metricIdHex.length === 1){
        metricIdHex = "0" + metricIdHex;
      }

      let command = this.ATCmds[ATCmd] + sensorIdHex + " " + metricIdHex + this.nextLine;
      console.log(command);
      return command;
    }else{
      console.log('wring cmd');
    }
  }

  respondsSuccess(key){
    return this.ATResponds[key]['SUCCESS'];
  }

  respondsFail(key){
    if(typeof this.ATResponds[key]['FAIL'] !== 'undefined'){
      return this.ATResponds[key]['FAIL']
    }else{
      return '';
    }
  }
  buildCommandMotherboard(cmd: string){
    console.log(this.ATCmds[cmd]);
    console.log(this.nextLine);
    return this.ATCmds[cmd] + this.nextLine;
  }

}
