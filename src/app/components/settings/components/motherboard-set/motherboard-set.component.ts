import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ElectronService} from "../../../../core/services";
import {interval, Subscription} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";
import {MotherboardService} from "../../../../core/services/motherboard/motherboard.service";
import {Motherboard} from "../../../../entity/motherboard/Motherboard";
import {MotherboardInUseService} from "../../../../core/services/motherboardInUse/motherboard-in-use.service";

@Component({
  selector: 'app-motherboard-set',
  templateUrl: './motherboard-set.component.html',
  styleUrls: ['./motherboard-set.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MotherboardSetComponent implements OnInit, OnDestroy {
  private searchMotherboardsSubscription;

  private motherboardsSubscription: Subscription;
  private motherboards: {[id: string] : Motherboard};
  private usedMotherboard: Motherboard;
  private usedMotherbordSubscription: Subscription;

  constructor(private motherboardService: MotherboardService, private motherboardInUseService: MotherboardInUseService,
              private electronService: ElectronService, private translate: TranslateService) {
    this.motherboardsSubscription = this.motherboardService.getAllmotherboards().subscribe(motherboards => {
      if (motherboards) {
        console.log(motherboards);
        this.motherboards = motherboards;
      }
    });

    this.usedMotherbordSubscription  = this.motherboardInUseService.Motherboard.subscribe(usedMotherboard => {
      if(typeof usedMotherboard != 'undefined'){
        console.log(usedMotherboard);
        console.log(usedMotherboard.sensors);
        this.usedMotherboard = usedMotherboard;
      }else{
        this.usedMotherboard = new Motherboard();
      }
    });
  }

  ngOnInit() {
  }

  usedMotherboardChanged(event){
    if(event.isUserInput) {
      console.log(this.motherboards[event.source.value]);
      this.motherboardInUseService.changeMotherboard(this.motherboards[event.source.value]);
    }
  }

  motherboardsArray(){
    console.log(Object.keys(this.motherboards));
    return Object.keys(this.motherboards);
  }

  motherboardSensors(){
   let sensorNames = [];
   for(let key of Object.keys(this.motherboards)){
     sensorNames.push(this.motherboards[key]['name']);
   }
  }

  ngOnDestroy(): void {
    if(this.searchMotherboardsSubscription){
      this.searchMotherboardsSubscription.unsubscribe();
    }
    if(this.motherboardsSubscription){
      this.motherboardsSubscription.unsubscribe();
    }
    if(this.usedMotherbordSubscription){
      this.usedMotherbordSubscription.unsubscribe();
    }
  }
}
