import {Component, Input, OnInit} from '@angular/core';
import {MotherboardInUseService} from "../../../../../../../../core/services/motherboardInUse/motherboard-in-use.service";
import {GlobalVariableCMD, GlobalVariableResponse} from "../../../../../../../../shared/global";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.scss']
})
export class PollingComponent implements OnInit {
  @Input() metricId: string;
  @Input() unit;
  private value;
  @Input() safeEvent: Observable<void>;
  private safeEvenSub: Subscription;
  constructor(private motherboardInUse: MotherboardInUseService) {
    this.getValues();
  }

  ngOnInit() {
    this.safeEvenSub = this.safeEvent.subscribe(() => {
      console.log('gesafed');
    });
  }

  valueChanged(event){
    this.value = event.target.value;
    this.motherboardInUse.setValue(this.metricId, GlobalVariableCMD.SET_POLLING_INTERVAL,
      this.value.toString(), GlobalVariableResponse.AT_SET_POLLING,
      GlobalVariableResponse.AT_SET_POLLING).catch(err => {
      let dataString = err.toString();
      if(dataString){
        console.log(dataString);
      }
    });
  }

  private getValues(){
    this.motherboardInUse.getValues(this.metricId, GlobalVariableCMD.GET_POLLING_INTERVAL,
      GlobalVariableResponse.GET_POLLING_INTERVAL, GlobalVariableResponse.GET_POLLING_INTERVAL).then(data => {
      let dataString = data.toString();
      if(dataString){
        this.value = parseInt(dataString);
      }
    }).catch(err => {
      console.log('error' + err);
    });
  }
}
