import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Sensor} from "../../../../entity/motherboard/Sensor";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit {
  @Input() sensor: Sensor;
  @Input() safeEvent: Observable<void>;
  private safeEvenSub: Subscription;
  private safeTrigger: Subject<void>;
  constructor() { }

  ngOnChanges(changes: SimpleChanges){
    console.log(this.sensor);
    console.log(changes);
  }

  ngOnInit() {
    this.safeEvenSub = this.safeEvent.subscribe(() => {
      console.log('gesafed');
      this.safeTrigger.next();
    })
  }

  ngOnDestroy(): void {
    this.safeEvenSub.unsubscribe();
  }
}
