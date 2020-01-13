import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureMotherboardComponent } from './configure-motherboard.component';

describe('ConfigureMotherboardComponent', () => {
  let component: ConfigureMotherboardComponent;
  let fixture: ComponentFixture<ConfigureMotherboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureMotherboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureMotherboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
