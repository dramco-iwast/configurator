import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, BrowserWindow } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as SerialPort from 'serialport';
import * as Yamlinc from 'yaml-include';
import * as Yaml from 'js-yaml';
import * as DownloadGitRepo from 'download-git-repo';
import * as Path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  window: BrowserWindow;

  serialPort: typeof SerialPort;
  path: typeof Path;
  yamlinc: typeof Yamlinc;
  yaml: typeof Yaml;
  downloadGitRepo: typeof DownloadGitRepo;
  i18nIsoCodes;

  get isElectron(): boolean {
    return window && window.process && window.process.type;
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      this.window = window.require('electron').remote.getCurrentWindow();

      this.i18nIsoCodes = require('i18n-iso-639-1');
      this.serialPort = window.require('serialport');
      this.yamlinc = window.require('yaml-include');
      this.yaml = window.require('js-yaml');
      this.downloadGitRepo = window.require('download-git-repo');
      this.path = window.require('path');
    }
  }
}
