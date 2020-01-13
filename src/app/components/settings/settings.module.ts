import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import {SettingsComponent} from "./settings.component";
import {LanguageComponent} from "./components/language/language.component";
import { MotherboardSetComponent } from './components/motherboard-set/motherboard-set.component';
import {SharedModule} from "../../shared/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [SettingsComponent, LanguageComponent, MotherboardSetComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
