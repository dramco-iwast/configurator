import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SensorRoutingModule } from './sensor-routing.module';
import { SensorComponent } from './sensor.component';
import {MetricModule} from "./components/metric/metric.module";


@NgModule({
  declarations: [SensorComponent],
  exports: [
    SensorComponent
  ],
  imports: [
    CommonModule,
    SensorRoutingModule,
    MetricModule
  ]
})
export class SensorModule { }
