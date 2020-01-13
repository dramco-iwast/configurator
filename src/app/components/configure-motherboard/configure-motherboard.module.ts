import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigureMotherboardRoutingModule } from './configure-motherboard-routing.module';
import { ConfigureMotherboardComponent } from './configure-motherboard.component';
import {SensorModule} from "./components/sensor/sensor.module";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [ConfigureMotherboardComponent],
  imports: [
    CommonModule,
    ConfigureMotherboardRoutingModule,
    SensorModule,
    SharedModule
  ]
})
export class ConfigureMotherboardModule { }
