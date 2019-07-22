import { CalendarEvent } from "nativescript-ui-calendar";
import { booleanConverter, Color } from "tns-core-modules/ui/page/page";
import { getFormattedTime, TimeFormat } from "../utils/pray-times-utils";
import { isString } from "util";

export class PrayTimeCalendarEvent extends CalendarEvent {
    _description: string;
    _type: PrayTimeCalendarEventType;
    _endDate: Date;
    _startDate: Date;
    _title: string;
    _time: string;
    
    constructor(
        title: string, // título do evento, tipicamente nome da oração
        description: string, // detalhes do evento
        date: Date, time: number | string, duration: number, // data de inicio, horário calculado e duração 
        formatTime: TimeFormat,
        type:PrayTimeCalendarEventType = PrayTimeCalendarEventType.UNKNOW,
        isAllDay?: boolean,
        eventColor?: Color) {

        // TODO dispensar time
        const year = date.getFullYear();
        const month = date.getMonth();
        const day: number = date.getDate();
        if (!isString(time)) {
            time = getFormattedTime(time, formatTime);
        }
        const hour = parseInt(time.split(":")[0]);
        const minute = parseInt(time.split(":")[1]);

        const startDate = new Date(year, month, day, hour, minute);
        const endDate = new Date(year, month, day, hour, minute + duration);

        super(title + " (" + time + ")", startDate, endDate, isAllDay, eventColor);

        this._title = title;
        this._time = time;
        this._description = description;
        this._type = type;
        this._startDate = startDate;
        this._endDate = endDate;

    }
}

export enum PrayTimeCalendarEventType{
        ESPECIAL_ASTRONOMIC_EVENT,
        ASTRONOMIC_EVENT,
        PRAY_EVENT,
        UNKNOW
}

