import { TestBed } from '@angular/core/testing';

import { MotherboardInUseService } from './motherboard-in-use.service';

describe('MotherboardInUseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MotherboardInUseService = TestBed.get(MotherboardInUseService);
    expect(service).toBeTruthy();
  });
});
