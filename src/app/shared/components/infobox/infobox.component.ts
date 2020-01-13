import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.scss']
})
export class InfoboxComponent implements OnInit {
  @Input('matTooltip') message: string;

  constructor() { }

  ngOnInit() {
  }

}
