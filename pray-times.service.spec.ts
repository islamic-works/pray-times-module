import { TestBed } from '@angular/core/testing';

import { PrayTimesService } from './pray-times.service';

describe('PrayTimesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrayTimesService = TestBed.get(PrayTimesService);
    expect(service).toBeTruthy();
  });
});
