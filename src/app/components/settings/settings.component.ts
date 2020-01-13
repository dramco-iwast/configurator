import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {MotherboardInUseService} from "../../core/services/motherboardInUse/motherboard-in-use.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private motherboardInUse: MotherboardInUseService,
              private router: Router,
              private r: ActivatedRoute) { }

  ngOnInit() {
  }

  return(){
    let motherboardvalue;
    console.log('motherboardAvailableClicked');
    const sub = this.motherboardInUse.Motherboard.pipe(take(1)).subscribe(value => {
      motherboardvalue = value;
      console.log('get value motherboardused');
      console.log(motherboardvalue);
    });
    sub.unsubscribe();
    console.log('unsub');
    if(typeof motherboardvalue != 'undefined' && motherboardvalue != null){
      this.router.navigate(['../motherboard']);
    }else{
      console.log('correct');
      this.router.navigate(['../motherboard']);
    }
  }
}
