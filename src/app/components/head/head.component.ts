import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../../core/services";
import {GlobalVariableNames, GlobalVariablePath} from "../../shared/global";

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  private basePathImage: string = "../../../../assets/icons/";

  private readonly imagePathMinimize: string = this.basePathImage;
  private readonly imagePathClose: string = this.basePathImage;

  private imagePathMaximize: string = this.basePathImage;

  constructor(private electron: ElectronService) {
    this.imagePathMinimize += GlobalVariableNames.IMAGE_NAME_MINIMIZE;
    this.imagePathClose += GlobalVariableNames.IMAGE_NAME_CLOSE;

    this.electron.window.isMaximized() ? this.imagePathMaximize += GlobalVariableNames.IMAGE_NAME_MAXIMIZED
      : this.imagePathMaximize += GlobalVariableNames.IMAGE_NAME_MAXIMIZE;
  }

  ngOnInit() {
  }

  closeWindow() {
    this.electron.window.close();
  }

  minimizeWindow() {
    this.electron.window.minimize();
  }

  maximizeWindow() {
    if(this.electron.window.isMaximized()){
      this.electron.window.unmaximize();
      this.imagePathMaximize = this.basePathImage + GlobalVariableNames.IMAGE_NAME_MAXIMIZE;
    }else{
      this.electron.window.maximize();
      this.imagePathMaximize = this.basePathImage + GlobalVariableNames.IMAGE_NAME_MAXIMIZED;
    }
  }
}
