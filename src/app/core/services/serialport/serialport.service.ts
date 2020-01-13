import {Injectable, OnInit} from '@angular/core';
import {FileService} from "../file/file.service";
import {MotherboardService} from "../motherboard/motherboard.service";
import {Motherboard} from "../../../entity/motherboard/Motherboard";
import {interval} from "rxjs";
import {startWith} from "rxjs/operators";
import {GlobalVariableCMD, GlobalVariablePath, GlobalVariableResponse} from "../../../shared/global";
import {CommandBuilderService} from "../commandBuilder/command-builder.service";
import {CommunicateService} from "../communicate/communicate.service";
import {MotherboardInUseService} from "../motherboardInUse/motherboard-in-use.service";
import {Sensor} from "../../../entity/motherboard/Sensor";
import {Metric} from "../../../entity/motherboard/Metric";
import {ElectronService} from "..";
import {type} from "os";
@Injectable({
  providedIn: 'root'
})

export class SerialportService implements OnInit{
  private alreadyContacedDevices = [];
  private motherboards;
  private usedMotherboard: Motherboard;
  private serialPort: any;
  private searchForMotherboardsSubscription;
  private checkLifeCycleMotherboardsSubscription;
  private readonly optionsPort;
  private timeSearch = 5000;
  private availableSensors: Sensor[];
  private ATResponds;
  constructor(private fileService: FileService,
              private motherboardService: MotherboardService,
              private commandBuilder: CommandBuilderService,
              private communicate: CommunicateService,
              private usedMotherboardService: MotherboardInUseService,
              private electronService: ElectronService) {
    this.serialPort = window.require('serialport');
    console.log('serialportService');
    this.optionsPort = {
      baudRate: 115200,
      parser: new this.serialPort.parsers.Readline('\n')
    };

    this.motherboardService.getAllmotherboards().subscribe(motherboards =>{
      console.log('serialport motherboards updated');
      console.log(motherboards);
      this.motherboards = motherboards;
    });
    this.usedMotherboardService.Motherboard.subscribe(motherboard => {
      console.log('serialport usedMotherboard updated');
      this.usedMotherboard = motherboard;
    });
    this.fileService.observableListAtResponds.subscribe(responses => {
      this.ATResponds = responses;
    });
    this.fileService.observableAllKnownSensors.subscribe(availableSensors => {
      this.availableSensors = availableSensors["sensors"];
      console.log('sensors filled ' + this.availableSensors);
    });
  }

  ngOnInit() {
  }

  searchForMotherboards() {
    console.log('looking');
    this.serialPort.list().then(ports =>{
      console.log(ports);
      if(ports.length > 0){
        let tempDiscoveredDevices = [];
        let command = this.commandBuilder.buildCommandMotherboard(GlobalVariableCMD.PING_INITIALIZE);
        let responds = this.commandBuilder.respondsSuccess(GlobalVariableResponse.PING_INITIALIZE);
        ports.forEach(port =>{
          let sp = new this.electronService.serialPort(port.path, this.optionsPort);
          if(typeof this.alreadyContacedDevices === 'undefined' || !this.alreadyContacedDevices.includes(port.serialNumber)){
            let respondsPort = this.communicate.communicate(command, sp,
              responds, '')
              .then(responds => {
                let respondsString = responds.toString();
                console.log(responds);
                this.createMotherboard(sp, respondsString);
              }).catch(err => {
                console.log(err);
              });
            tempDiscoveredDevices.push(port.serialNumber);
          }else{
            console.log('already contacted');
            //popup box?
          }
        });
        this.alreadyContacedDevices = tempDiscoveredDevices.concat(this.alreadyContacedDevices);
      }
    })
  }

  private createMotherboard(serialPort: any, id: string){
    let cmd = this.commandBuilder.buildCommandMotherboard(GlobalVariableCMD.LIST_DEVICES);
    let response = this.commandBuilder.respondsSuccess(GlobalVariableResponse.LIST_DEVICES);
    let motherboard = new Motherboard();
    motherboard.serialPort = serialPort;
    motherboard.id = id;
    console.log('create moederbord' + JSON.stringify(this.availableSensors));
    this.communicate.communicate(cmd, serialPort, response, '').then(stringSensors => {
      let listSensorsString = stringSensors.toString();
      if(!listSensorsString || /^\s*$/.test(listSensorsString)){
        console.log('motherboard has no sensors');
      }else{
        console.log(listSensorsString);
        let listSensors = listSensorsString.split(' ');
        listSensors.forEach(sensor => {
          console.log(sensor);
          let arrayInfoSensor = sensor.match(/.{1,2}/g);
          let sensorId = parseInt(arrayInfoSensor[0], 16).toString();
          let sensorType = parseInt(arrayInfoSensor[1], 16).toString();
          let sensorObj = new Sensor(sensorId, sensorType);
          console.log(JSON.stringify(this.availableSensors));
          console.log(JSON.stringify(this.availableSensors[sensorType]));
          console.log(JSON.stringify(this.availableSensors[sensorType]["name"]));
          let infoSensor = this.availableSensors[sensorType];
          let metricsSensor = infoSensor['sensor-metric'];
          sensorObj.name = infoSensor["name"];
          console.log(JSON.stringify(sensorObj));
          sensorObj.info = infoSensor["info"];
          console.log(JSON.stringify(sensorObj));
          metricsSensor.forEach(metric => {
            let metricObj = new Metric(metric['id']);
            metricObj.unit = metric["unit"];
            metricObj.quantity = metric['quantity'];
            metricObj.config = metric["config"];
            metricObj.info = metric["info"];
            sensorObj.metrics[metricObj.id] = metricObj;
          });
          motherboard.sensors[sensorId] = sensorObj;
          console.log(JSON.stringify(motherboard.sensors));
        });
      }
    });
    this.motherboardService.addMotherboard(motherboard);
  }

  checkLifeCycle(){
    if(typeof this.motherboards != 'undefined' && Object.keys(this.motherboards).length > 0){
      for(let key in this.motherboards){
        let motherboard: Motherboard;
        motherboard = this.motherboards[key];
        if(motherboard.id != this.usedMotherboard.id){
          this.checkLifeCycleMotherboard(motherboard);
        }
      }
    }else{
      console.log('no motherboards');
    }
  }

  private checkLifeCycleMotherboard(motherboard: Motherboard){
    let command = this.commandBuilder.buildCommandMotherboard(GlobalVariableCMD.PING_INITIALIZE);
    let response = this.communicate.communicate(command, motherboard.serialPort
      , GlobalVariableResponse.PING_INITIALIZE, '').catch(err => {
      this.motherboardService.removeMotherboard(motherboard.id);
    })
  }
}
