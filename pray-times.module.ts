import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { PrayTimesRoutingModule } from './pray-times-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { PrayTimesCalendarComponent } from './pray-times-calendar/pray-times-calendar.component';
import { MenuModule } from '../menu/menu.module';


@NgModule({
  declarations: [PrayTimesCalendarComponent],
  imports: [
    PrayTimesRoutingModule,
    NativeScriptCommonModule,
    MenuModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [PrayTimesCalendarComponent],
  entryComponents: [PrayTimesCalendarComponent]
})
export class PrayTimesModule { }
