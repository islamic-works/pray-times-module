import { Component, OnInit } from '@angular/core';
import { PrayTimesService } from '../pray-times.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { } from 'nativescript-calendar';
import { RadCalendar, CalendarEvent, CalendarViewMode, CalendarEventsViewMode } from 'nativescript-ui-calendar';
import { SettingsService } from '~/app/services/settings.service';

@Component({
    selector: 'ns-pray-times-calendar',
    templateUrl: './pray-times-calendar.component.html',
    styleUrls: ['./pray-times-calendar.component.scss'],
    moduleId: module.id,
})
export class PrayTimesCalendarComponent implements OnInit {

    active: string;

    viewMode: CalendarViewMode = CalendarViewMode.Day;
    eventsViewMode: CalendarEventsViewMode = CalendarEventsViewMode.Inline;

    minDate: Date = new Date();

    constructor(
        private page: Page,
        private settings: SettingsService,
        private prayTimes: PrayTimesService) { }

    ngOnInit() {

        this.minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() - this.minDate.getDay());
        
        this.active = "praytimes";
        this.page.actionBarHidden = true;

        this.viewMode = CalendarViewMode.Week;
        if (this.settings.debug) console.log("PrayTimesCalendar Component Init!");
    }

    public get times(): CalendarEvent[] {
        let times = this.prayTimes.getTimes();
        if (this.settings.debug) console.log("PrayTimesCalendar.Component: times:", times);

        return times;
    }
}
