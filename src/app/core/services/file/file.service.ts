import { Injectable } from '@angular/core';
import * as DownloadGitRepo from 'download-git-repo';
import {BehaviorSubject, Observable} from "rxjs";
import {ConnectionService} from "ng-connection-service";
import {GlobalVariableNames, GlobalVariablePath} from "../../../shared/global";
import {Sensor} from "../../../entity/motherboard/Sensor";
import {ElectronService} from "..";
import * as Yamlinc from 'yaml-include';
import * as Yaml from 'js-yaml';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private hasDownloadedDocuments;
  private readonly downloadGitRepo: typeof DownloadGitRepo;
  private yamlinc: typeof Yamlinc;
  private yaml: typeof Yaml;
  private assetsYaml = this.electronService.path.join('src', 'assets', 'yaml');
  private listAtCommands: string[];
  private _observableListAtCommands: BehaviorSubject<string[]>;

  get observableListAtCommands(): Observable<string[]>
  {
    return this._observableListAtCommands.asObservable()
  }

  private listATResponds: string[];
  private _observableListAtResponds: BehaviorSubject<string[]>;

  get observableListAtResponds(): Observable<string[]>
  {
    return this._observableListAtResponds.asObservable()
  }

  private listAllKnownSensors: Sensor[];
  private _observableAllKnownSensors: BehaviorSubject<Sensor[]>;

  get observableAllKnownSensors(): Observable<Sensor[]>
  {
    return this._observableAllKnownSensors.asObservable()
  }

  constructor(private connectionService: ConnectionService,
              private electronService: ElectronService,
              private translateService: TranslateService)
  {
    this.yamlinc = window.require('yaml-include');
    this.yaml = window.require('js-yaml');
    this.downloadGitRepo = window.require('download-git-repo');

    this._observableAllKnownSensors = new BehaviorSubject<Sensor[]>([]);
    this._observableListAtCommands = new BehaviorSubject<string[]>([]);
    this._observableListAtResponds = new BehaviorSubject<string[]>([]);
    console.log('voor connected');
    //this.downloadGitRepository(GlobalVariablePath.BASE_GIT_URL, GlobalVariablePath.BASE_PATH_YAML);
    this.fillYamlVariables();

    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        console.log('hier ben ik na connectede');
        if(!this.hasDownloadedDocuments){
          this.downloadGitRepository(GlobalVariablePath.BASE_GIT_URL, GlobalVariablePath.BASE_PATH_YAML);
          this.hasDownloadedDocuments = true;
          this.fillYamlVariables();
        }
      }
    })
  }

  private downloadGitRepository(url: string, fileDir: string){
    this.downloadGitRepo(url,  fileDir, err =>{
      if(err){
        console.log("error: " + err);
        console.log("url: " + url);
        console.log("filedir: " + fileDir)
      }else{
        this.fillYamlVariables();
      }
      this.fillYamlVariables();
    });
  }

  private fillATCommands(){
    const src = this.electronService.fs.readFile(this.electronService.path.join(this.assetsYaml,  GlobalVariableNames.FILE_NAME_AT_COMMANDS+ '.yaml'), 'utf8', (err, content) =>{
      if(!err) {
        console.log(content);
        let temp = this.electronService.yaml.load(content, {schema: this.electronService.yamlinc.YAML_INCLUDE_SCHEMA});
        if(!this.checkFilesEqual(temp, this.listAtCommands)){
          this.listAtCommands = temp;
          console.log(this.listAtCommands);
          this._observableListAtCommands.next(this.listAtCommands);
        }
      }
    });
  }

  private fillATResponse(){
    const src = this.electronService.fs.readFile(this.electronService.path.join(this.assetsYaml,  GlobalVariableNames.FILE_NAME_AT_RESPONDS+ '.yaml'), 'utf8', (err, content) =>{
      if(!err){
        console.log(content);
        let temp = this.electronService.yaml.load(content, {schema: this.electronService.yamlinc.YAML_INCLUDE_SCHEMA});
        if(!this.checkFilesEqual(temp, this.listATResponds)){
          this.listATResponds = temp;
          this._observableListAtResponds.next(this.listATResponds);
        }
      }else{
        console.log(err);
      }
    });
  }

  private fillKnownSensors(){
    console.log('gehrgregruer');
    const src = this.electronService.fs.readFile(this.electronService.path.join(this.assetsYaml,  GlobalVariableNames.FILE_NAME_KNOWN_SENSORS+ '.yaml'), 'utf8', (err, content) =>{
      if(!err){
        console.log(content);
        process.chdir(this.assetsYaml);
        console.log('geraken we hier voor de yaml load?');
        let temp = this.electronService.yaml.load(content, {schema: this.electronService.yamlinc.YAML_INCLUDE_SCHEMA});
        console.log(!this.checkFilesEqual(temp, this.listAllKnownSensors));
        if(!this.checkFilesEqual(temp, this.listAllKnownSensors)){
          console.log(temp);
          this.listAllKnownSensors = temp;
          this._observableAllKnownSensors.next(this.listAllKnownSensors);
        }
      }else{
        console.log(err);
      }
    });
  }

  private fillYamlVariables(){
    console.log('fill in all variables');
    this.fillATCommands();
    this.fillATResponse();
    this.fillKnownSensors();
  }

  private checkFilesEqual(file1, file2){
    console.log('check if files are equal' +  file2 + " " + file1);
    let flag = true;
    if(typeof file2 === 'undefined') return  false;
    if(Object.keys(file1).length==Object.keys(file2).length){
      for(let key in file1) {
        if(file1[key] != file2[key]) {
          flag=false;
          break;
        }
      }
    }
    else {
      flag=false;
    }
    return flag;
  }
}
