import { TestBed } from '@angular/core/testing';

import { DienstberichtService } from './dienstbericht.service';

describe('DienstberichtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DienstberichtService = TestBed.get(DienstberichtService);
    expect(service).toBeTruthy();
  });
});
