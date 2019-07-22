import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';

import { MenuModule } from '../menu/menu.module';

import { PrayTimesService } from './pray-times.service'
import { CalendarStylesService } from './calendar-styles.service'

import { PrayTimesRoutingModule } from './pray-times-routing.module';
import { PrayTimesCalendarComponent } from './pray-times-calendar/pray-times-calendar.component';

@NgModule({
    declarations: [PrayTimesCalendarComponent],
    imports: [
        NativeScriptUICalendarModule,
        PrayTimesRoutingModule,
        NativeScriptCommonModule,
        MenuModule
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [PrayTimesCalendarComponent],
    entryComponents: [PrayTimesCalendarComponent],
    providers: [PrayTimesService, CalendarStylesService]
})
export class PrayTimesModule { }
