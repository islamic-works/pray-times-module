import { NgModule, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from "nativescript-angular/forms"

import { NativeScriptUICalendarModule } from 'nativescript-ui-calendar/angular';

import { MenuModule } from '../menu/menu.module';

import { PrayTimesService } from './pray-times.service'
import { CalendarStylesService } from './calendar-styles.service'

import { PrayTimesRoutingModule } from './pray-times-routing.module';
import { PrayTimesCalendarComponent } from './pray-times-calendar/pray-times-calendar.component';

import { SettingsService } from '../services/settings.service';

@NgModule({
    declarations: [PrayTimesCalendarComponent],
    imports: [
        NativeScriptUICalendarModule,
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        PrayTimesRoutingModule,
        MenuModule
    ],
    schemas: [NO_ERRORS_SCHEMA],
    exports: [PrayTimesCalendarComponent],
    entryComponents: [PrayTimesCalendarComponent],
    providers: [PrayTimesService, CalendarStylesService]
})
export class PrayTimesModule implements OnInit {
    private readonly _version: number;

    public static readonly MODULE_NAME = "PrayTimes";

    constructor(private _settings: SettingsService) {
        this._version = 201907222045;
    };

    /**
     * Inicializa toda a aplicação para uso com Angular
     */
    ngOnInit() {
        this._settings.checkVersion(PrayTimesModule.MODULE_NAME, this._version);
    }
}
