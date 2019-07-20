import { Component, OnInit, ViewChild } from '@angular/core';
import { PrayTimesService } from '../pray-times.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { } from 'nativescript-calendar';
import { RadCalendar, CalendarEvent, CalendarViewMode, CalendarEventsViewMode, CalendarSelectionEventData } from 'nativescript-ui-calendar';
import { SettingsService } from '~/app/services/settings.service';
import { RadCalendarComponent } from 'nativescript-ui-calendar/angular/calendar-directives';

@Component({
    selector: 'ns-pray-times-calendar',
    templateUrl: './pray-times-calendar.component.html',
    styleUrls: ['./pray-times-calendar.component.scss'],
    moduleId: module.id,
})
export class PrayTimesCalendarComponent implements OnInit {
    @ViewChild("prayTimesCalendar", { static: false }) _calendar: RadCalendarComponent;
    
    active: string;

    viewMode: CalendarViewMode = CalendarViewMode.Day;
    eventsViewMode: CalendarEventsViewMode = CalendarEventsViewMode.Inline;

    minDate: Date = new Date();

    displayedDate: Date = new Date();
    prayEvents: CalendarEvent[];

    constructor(
        private page: Page,
        private settings: SettingsService,
        private service: PrayTimesService) { }

    ngOnInit() {

        this.displayedDate = new Date();
        this.minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() - this.minDate.getDay());

        this.active = "praytimes";
        this.page.actionBarHidden = true;

        if (this.settings.debug) console.log("PrayTimesCalendar Component Init!");
    }

    public get times(): CalendarEvent[] {
        let times = this.service.getTimes();
        if (this.settings.debug) console.log("PrayTimesCalendar.Component: times:", times);

        return times;
    }

    onDateSelected(args: CalendarSelectionEventData) {
        const calendar: RadCalendar = args.object;
        const date: Date = args.date;
        const events: Array<CalendarEvent> = calendar.getEventsForDate(date);

        this.prayEvents = events;
    }

    onTodayTap(){
        const date = new Date();
        this._calendar.nativeElement.goToDate(date);
    }
    
    onNewEventTap(){

    }
}
