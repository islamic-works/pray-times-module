import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

import { RadCalendar, CalendarEvent, CalendarViewMode, CalendarEventsViewMode, CalendarSelectionEventData, DayEventsViewStyle, CalendarDayViewStyle, CalendarInlineEventSelectedData } from 'nativescript-ui-calendar';

import { RadCalendarComponent } from 'nativescript-ui-calendar/angular/calendar-directives';
import { Fab } from 'nativescript-floatingactionbutton';


import { PrayTimesService } from '../pray-times.service';
import { SettingsService } from '~/app/services/settings.service';
import { CalendarStylesService } from './../calendar-styles.service';
import { PrayTimeCalendarEvent } from '../model/pray-time-calendar-event';

@Component({
    selector: 'ns-pray-times-calendar',
    templateUrl: './pray-times-calendar.component.html',
    styleUrls: ['./pray-times-calendar.component.scss'],
    moduleId: module.id,
})
export class PrayTimesCalendarComponent implements OnInit {
    @ViewChild("prayTimesCalendar", { static: false }) private _calendar: RadCalendarComponent;
    @ViewChild("prayTimesMenuNew", { static: false }) private _menuNew: Fab;
    @ViewChild("prayTimesMenuToDay", { static: false }) private _menuToDay: Fab;

    active: string;

    viewMode: CalendarViewMode = CalendarViewMode.Day;
    eventsViewMode: CalendarEventsViewMode;

    minDate: Date = new Date();
    actualDate: Date;

    displayedDate: Date = new Date();
    prayEvents: CalendarEvent[];
    monthViewStyle: any;
    monthNamesViewStyle: any;
    weekViewStyle: any;
    yearViewStyle: any;
    dayViewStyle: CalendarDayViewStyle;

    locale: string;

    constructor(
        private page: Page,
        private settings: SettingsService,
        private service: PrayTimesService,
        private _styleService: CalendarStylesService) { }

    ngOnInit() {
        // this._menuNew.addEventListener("tap", (data) => console.log(data));

        this.active = "praytimes";
        this.page.actionBarHidden = true;

        this.locale = "pt-BR";

        this.eventsViewMode = CalendarEventsViewMode.None;

        /*
          [monthViewStyle]="monthViewStyle" [weekViewStyle]="weekViewStyle" [monthNamesViewStyle]="monthNamesViewStyle"
            [yearViewStyle]="yearViewStyle" [dayViewStyle]="dayViewStyle" 
            
        this.monthViewStyle = this._styleService.getMonthViewStyle();
        this.monthNamesViewStyle = this._styleService.getMonthNamesViewStyle();
        this.weekViewStyle = this._styleService.getWeekViewStyle();
        this.yearViewStyle = this._styleService.getYearViewStyle();
        this.dayViewStyle = this._styleService.getDayViewStyle();
*/

        this.dayViewStyle = this._styleService.getDayViewStyle__2();
        
        this.displayedDate = new Date();
        this.minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() - this.minDate.getDay());

        if (this.settings.debug) console.log("PrayTimesCalendar Component Init!");
    }

    public get times(): CalendarEvent[] {
        let times = this.service.getEventsForDate(this.actualDate);
        if (this.settings.debug) console.log("PrayTimesCalendar.Component: times:", times);

        return times;
    }

    onInlineEventSelectedEvent(args:CalendarInlineEventSelectedData){
        console.log(args);
    }

    onDateSelected(args: CalendarSelectionEventData) {
        const calendar: RadCalendar = args.object;

        this.actualDate = args.date;
        const events: Array<CalendarEvent> = calendar.getEventsForDate(this.actualDate);

        if (!events.find((v, i, o) => {
            console.log(v);
            if (v instanceof PrayTimeCalendarEvent) return true; return false
        })) {
            console.log("Não há eventos nesta data");
        }
        this.prayEvents = events;

        if (this.settings.debug) console.log("PrayTimesCalendar.onDateSelected");

        return true;
    }

    onTodayTap() {
        const date = new Date();
        this._calendar.nativeElement.goToDate(date);
        if (this.settings.debug) console.log("PrayTimesCalendar.onTodayTap");
    }

    onNewEventTap() {
        if (this.settings.debug) console.log("PrayTimesCalendar.onNewEventTap");
    }

    onDayViewEventSelected(event) {
        if (this.settings.debug)
            console.log("pray-times-calendar.component.onDayViewEventSelected: " + event);
    }
}
