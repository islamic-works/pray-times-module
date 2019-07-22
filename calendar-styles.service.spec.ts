import { TestBed } from '@angular/core/testing';

import { CalendarStylesService } from './calendar-styles.service';

describe('CalendarStylesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendarStylesService = TestBed.get(CalendarStylesService);
    expect(service).toBeTruthy();
  });
});
