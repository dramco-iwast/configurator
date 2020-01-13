import { TestBed } from '@angular/core/testing';

import { MotherboardService } from './motherboard.service';

describe('MotherboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MotherboardService = TestBed.get(MotherboardService);
    expect(service).toBeTruthy();
  });
});
