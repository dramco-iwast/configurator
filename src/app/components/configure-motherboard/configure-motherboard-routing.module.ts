import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConfigureMotherboardComponent} from "./configure-motherboard.component";


const routes: Routes = [
  {
    path: '',
    component: ConfigureMotherboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigureMotherboardRoutingModule { }
