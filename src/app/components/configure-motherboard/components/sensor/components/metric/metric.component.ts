import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Metric} from "../../../../../../entity/motherboard/Metric";
import {TranslateService} from "@ngx-translate/core";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.scss']
})
export class MetricComponent implements OnInit, OnDestroy {
  @Input() metric: Metric;
  @Input() safeEvent: Observable<void>;
  private safeEvenSub: Subscription;
  private safeTrigger: Subject<void>;

  private hasPolling = false;
  private hasThreshold = false;
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.hasPolling = this.metric['config']['polling']['enabled'];
    this.hasThreshold = this.metric['config']['threshold']['enabled'];
    console.log(this.metric);
    console.log(this.metric['config']['threshold']['max']);
    console.log(this.metric['config']['threshold']['min']);
    console.log(this.hasPolling);
    console.log(this.hasThreshold);
    this.safeEvenSub = this.safeEvent.subscribe(() =>{
      console.log('gesaved');
      this.safeTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.safeEvenSub.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges){
    console.log(this.metric);
    console.log(changes);
  }

  safeConfig(){

  }
}
