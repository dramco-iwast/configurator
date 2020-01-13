import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Options} from "ng5-slider";
import {TranslateService} from "@ngx-translate/core";
import {MotherboardInUseService} from "../../../../../../../../core/services/motherboardInUse/motherboard-in-use.service";
import {GlobalVariableCMD, GlobalVariableResponse} from "../../../../../../../../shared/global";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.scss']
})
export class ThresholdComponent implements OnInit {
  @Input() metricId : string;
  @Input() ceil;
  @Input() floor;

  private minimumThreshold;
  private maximumThreshold;
  private enabled: boolean;
  @Input() safeEvent: Observable<void>;
  private safeEvenSub: Subscription;
  options: Options = {
    floor: 100,
    ceil: 200
  };

  constructor(private translate: TranslateService,
              private motherboardInUse: MotherboardInUseService) {
    this.getValuesThreshold();
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(this.metricId);
    this.options.floor = this.floor;
    this.options.ceil = this.ceil;
    this.getValuesThreshold();
  }

  ngOnInit() {
    this.safeEvenSub = this.safeEvent.subscribe(() => {
      console.log('gesafed');
    });
  }

  private setValue(command: string, value: string, expectedResponse:string, notExpectedResponse: string){
    let response = '';
    this.motherboardInUse.setValue(this.metricId, command,
      value.toString(), expectedResponse, notExpectedResponse).catch(err => {
      let dataString = err.toString();
      if(dataString){
        response = dataString;
      }
    });
    return response;
  }

  minimumValueChanged() {
    let response = this.setValue(GlobalVariableCMD.SET_THRESHOLD_LOW,
      this.minimumThreshold, GlobalVariableResponse.AT_SET_THRESHOLD,
      GlobalVariableResponse.AT_SET_THRESHOLD);
    if(response){
      console.log(response);
    }
  }

  highValueChanged(){
    let response = this.setValue(GlobalVariableCMD.SET_THRESHOLD_HIGH,
      this.maximumThreshold, GlobalVariableResponse.AT_SET_THRESHOLD,
      GlobalVariableResponse.AT_SET_THRESHOLD);
    if(response){
      console.log(response);
    }
  }

  thresholdEnabledChanged(){
    let value = + this.enabled;
    let response = this.setValue(GlobalVariableCMD.SET_THRESHOLD_ENABLED,
      value.toString(), GlobalVariableResponse.AT_SET_THRESHOLD,
      GlobalVariableResponse.AT_SET_THRESHOLD);
    if(response){
      console.log(response);
    }
  }

  private getValuesThreshold(): void{
    this.motherboardInUse.getValues(this.metricId, GlobalVariableCMD.GET_THRESHOLD_VALUES,
      GlobalVariableResponse.GET_POLLING_INTERVAL, GlobalVariableResponse.GET_POLLING_INTERVAL).then(data => {
      let dataString = data.toString();
      if(dataString){
        console.log(dataString);
        let responseSplit = dataString.toString().split(' ');
        let minimumValue = parseInt(responseSplit[1]);
        let maximumValue = parseInt(responseSplit[2]);
        minimumValue < this.floor ? this.minimumThreshold = this.floor : this.minimumThreshold = minimumValue;
        maximumValue > this.ceil ? this.maximumThreshold = this.ceil : this.maximumThreshold = maximumValue;
        this.enabled = responseSplit[0].includes('1');
        console.log(this.minimumThreshold);
        console.log(this.maximumThreshold);
        console.log(this.enabled);
      }
    }).catch(err => {
      let errString = err.toString();
      if(errString){
        console.log(errString);
      }
    });
  }
}
