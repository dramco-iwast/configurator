import { TestBed } from '@angular/core/testing';

import { CommandBuilderService } from './command-builder.service';

describe('CommandBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandBuilderService = TestBed.get(CommandBuilderService);
    expect(service).toBeTruthy();
  });
});
