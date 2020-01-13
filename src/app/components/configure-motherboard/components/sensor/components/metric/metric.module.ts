import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricRoutingModule } from './metric-routing.module';
import { MetricComponent } from './metric.component';
import { ThresholdComponent } from './components/threshold/threshold.component';
import { PollingComponent } from './components/polling/polling.component';
import {SharedModule} from "../../../../../../shared/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Ng5SliderModule} from "ng5-slider";
import {MatCheckboxModule} from "@angular/material/checkbox";


@NgModule({
  declarations: [MetricComponent, ThresholdComponent, PollingComponent],
  exports: [
    MetricComponent
  ],
  imports: [
    CommonModule,
    MetricRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    Ng5SliderModule,
    MatCheckboxModule
  ]
})
export class MetricModule { }
