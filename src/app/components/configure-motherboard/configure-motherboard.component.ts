import { Component, OnInit } from '@angular/core';
import {Motherboard} from "../../entity/motherboard/Motherboard";
import {TranslateService} from "@ngx-translate/core";
import {MotherboardInUseService} from "../../core/services/motherboardInUse/motherboard-in-use.service";
import {Sensor} from "../../entity/motherboard/Sensor";
import {Metric} from "../../entity/motherboard/Metric";
import {Subject} from "rxjs";

@Component({
  selector: 'app-configure-motherboard',
  templateUrl: './configure-motherboard.component.html',
  styleUrls: ['./configure-motherboard.component.scss']
})
export class ConfigureMotherboardComponent implements OnInit {
  motherboard: Motherboard;
  usedSensorId: string;
  private safeEvenSubject: Subject<void> = new Subject<void>();
  constructor(private translate: TranslateService,
              private motherboardInUse: MotherboardInUseService) {
    motherboardInUse.Motherboard.subscribe(motherboard => {
      this.motherboard = motherboard;
      console.log(JSON.stringify(this.motherboard["sensors"]));
    });
  }

  ngOnInit() {
  }

  sensorClicked(event){
    this.usedSensorId = event.target.attributes.sensorid.value;
    console.log(this.usedSensorId);
    this.motherboardInUse.setUsedSensorId(this.usedSensorId);
    console.log(this.usedSensorId);
    console.log(this.motherboardInUse.getUsedSensorId());
  }

  closeClicked(){
    this.motherboardInUse.close().then(succes => {
      console.log('worked');
    })
  }

  safeConfig(){
    console.log('safe gedrukt');
    this.safeEvenSubject.next();
  }
}
