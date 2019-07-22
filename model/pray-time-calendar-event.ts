import { CalendarEvent } from "nativescript-ui-calendar";
import { booleanConverter, Color } from "tns-core-modules/ui/page/page";

export class PrayTimeCalendarEvent extends CalendarEvent {
    _description: string;
    _pray: boolean;
    constructor(title: string, description: string, startDate: Date, endDate: Date, pray?:boolean, isAllDay?: boolean, eventColor?: Color) {
        super(title, startDate, endDate, isAllDay, eventColor);
        this._description = description;
        this._pray = pray;
    }
}