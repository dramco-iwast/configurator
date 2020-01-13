import {Component, OnDestroy, OnInit} from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import {fromEvent, interval, Observable, Subscription} from 'rxjs';
import {ViewEncapsulation } from '@angular/core';
import {Router} from "@angular/router";
import {MotherboardService} from "./core/services/motherboard/motherboard.service";
import {MotherboardInUseService} from "./core/services/motherboardInUse/motherboard-in-use.service";
import {FileService} from "./core/services/file/file.service";
import {SerialportService} from "./core/services/serialport/serialport.service";
import {startWith} from "rxjs/operators";
import {Motherboard} from "./entity/motherboard/Motherboard";
import {GlobalVariableCMD, GlobalVariableResponse} from "./shared/global";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy{
  private motherboardsSubscription: Subscription;
  private searchForMotherboardsSubscription: Subscription;
  private timeSearch = 5000;
  private checkLifeCycleMotherboardsSubscription: Subscription;
  private motherboardInUseSubscription: Subscription;
  private motherboardInUse: Motherboard;
  private motherboards: {[id: string] : Motherboard};
  constructor(
    private serialportService: SerialportService,
    public electronService: ElectronService,
    private translate: TranslateService,
    private motherboardService: MotherboardService,
    private router: Router,
    private motherboard: MotherboardInUseService,
    private fileService: FileService
  ) {
    this.motherboards = {};

  }

  ngOnInit(): void {
    this.searchForMotherboardsSubscription = interval(5000).subscribe(() =>{
      console.log('searching');
      if (this.motherboardInUse === null || typeof this.motherboardInUse === 'undefined' || this.motherboardInUse.id === null || this.motherboardInUse.id === "none"){
        this.serialportService.searchForMotherboards();
      }
    });

     // this.searchForMotherboardsSubscription = interval(this.timeSearch).pipe(startWith(0)).subscribe(() => {
     //   console.log('searching for motherboard');
     //   this.serialportService.searchForMotherboards();
     //   console.log(this.timeSearch)
     // });
     //

     this.motherboardInUseSubscription = this.motherboard.Motherboard.subscribe(motherboard => {
       console.log('geraken we hier?');
       if(typeof motherboard !== 'undefined')
         this.motherboardInUse = motherboard;
         if(motherboard === null || motherboard.id === "none"){
           console.log(this.router.url);
           if(this.router.url !== '/'){
             this.router.navigate(['']).then(() => console.log(this.router.url));
           }
         }else if(this.router.url !== '/settings'){
           this.router.navigate(['motherboard']).then(() => console.log(this.router.url));
         }
     });

     this.checkLifeCycleMotherboardsSubscription = interval(this.timeSearch).subscribe(() => {
        if(this.motherboardInUse !== null && this.motherboardInUse.id !== 'none' && Object.keys(this.motherboards).length > 1){
          this.serialportService.checkLifeCycle();
        }
     });

     this.motherboardsSubscription = this.motherboardService.getAllmotherboards().subscribe(motherboards => {
       if(typeof motherboards !== 'undefined'){
         this.motherboards = motherboards;
         if(typeof  this.motherboardInUse === 'undefined' || this.motherboardInUse === null || this.motherboardInUse.id !== 'none'){
           if(Object.keys(motherboards).length === 1){
             this.motherboard.changeMotherboard(motherboards[Object.keys(motherboards)[0]]);
           }else{
             //pop up mss
             this.motherboard.changeMotherboard(motherboards[Object.keys(motherboards)[0]]);
           }
         }
       }
     });
  }

  ngOnDestroy(): void {
    this.motherboardsSubscription.unsubscribe();
    this.searchForMotherboardsSubscription.unsubscribe();
    this.checkLifeCycleMotherboardsSubscription.unsubscribe();
    this.motherboardInUseSubscription.unsubscribe();
  }
}
