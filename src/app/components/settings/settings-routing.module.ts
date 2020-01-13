import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from "./settings.component";
import {MotherboardSetComponent} from "./components/motherboard-set/motherboard-set.component";
import {LanguageComponent} from "./components/language/language.component";

const routes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      {
        path: 'motherboard', component: MotherboardSetComponent
      },
      {
        path: 'language', component: LanguageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
