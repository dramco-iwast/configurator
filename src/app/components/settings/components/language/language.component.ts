import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ElectronService} from "../../../../core/services";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LanguageComponent implements OnInit {
  languages: any[];
  constructor(private electronService: ElectronService, private translate: TranslateService) { }
  currentLanguage: any;

  ngOnInit() {
    this.languages = this.electronService.i18nIsoCodes.getLanguages( this.translate.getLangs());
    this.currentLanguage = this.translate.currentLang;
  }

  languageChange(event){
    if (event.isUserInput){
      console.log(event);
      this.translate.use(event.source.value);
    }
  }
}


