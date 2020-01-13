import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';

import { PageNotFoundComponent } from './components';
import { WebviewDirective } from './directives';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { InfoboxComponent } from './components/infobox/infobox.component';
import {MatTooltipModule} from "@angular/material/tooltip";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, InfoboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatTooltipModule
  ],
  exports: [TranslateModule, WebviewDirective, FormsModule, InfoboxComponent]
})
export class SharedModule {
  constructor(private  translate: TranslateService){
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('en');
    translate.use(this.translate.getBrowserLang());
  }
}
