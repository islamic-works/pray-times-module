import { Injectable, OnInit } from '@angular/core';

import { CalendarEvent } from 'nativescript-ui-calendar';

import { SettingsService } from '../services/settings.service';
import { PrayTimes } from './utils/praytimes';
import { Color } from 'tns-core-modules/color/color';
import { GpsData } from './utils/gps-data';
import { PrayTimeCalendarEvent, PrayTimeCalendarEventType } from './model/pray-time-calendar-event';
import { PrayTimesSettings } from './utils/pray-times-settings';
import { PrayTimesModule } from './pray-times.module';
import { PrayTimesEvents } from './utils/pray-times-info';


@Injectable({
    providedIn: 'root'
})
export class PrayTimesService {
    private prayTimes: PrayTimes;

    get prayTimesMethod(): string {
        return this.getSettings().method;
    }

    get showAstronomicEvents(): boolean {
        return this.getSettings().showAstronomicEvents;
    }

    constructor(private settings: SettingsService) {
        /*
       MWL: 'Muslim World League',
       ISNA: 'Islamic Society of North America (ISNA)',
       Egypt: 'Egyptian General Authority of Survey',
       Makkah: 'Umm Al-Qura University, Makkah',
       Karachi: 'University of Islamic Sciences, Karachi',
       Tehran: 'Institute of Geophysics, University of Tehran',
       Jafari: 'Shia Ithna-Ashari, Leva Institute, Qum',
         */

        let prayTimesMethod = this.prayTimesMethod;
        if (this.settings.debug) console.log("Pray Times Method:", prayTimesMethod);
        this.prayTimes = new PrayTimes(prayTimesMethod);
        if (this.settings.debug) console.log("PrayTimes Services Init!");

        if (this.settings.debug) {
            console.log("Método: ", this.prayTimes.getMethod());
        }
    }

    private getSettings(param?: string) {
        return this.settings.getSettings<PrayTimesSettings>(PrayTimesModule.MODULE_NAME);
    }

    getEventsForDate(date: Date = new Date()): Array<PrayTimeCalendarEvent> {
        if (this.settings.debug) console.log("get times: ", date);

        const colors: Array<Color> = [new Color(200, 188, 26, 214), new Color(220, 255, 109, 130), new Color(255, 55, 45, 255), new Color(199, 17, 227, 10), new Color(255, 255, 54, 3)];

        const events: Array<PrayTimeCalendarEvent> = new Array<PrayTimeCalendarEvent>();

        /*
      Latitude  : - 3.7167,
      Longitude : -38.5
      Distance  : 10595 km
      Qibla Direction 36.25° from East toward North
     */
        // lat, lng, elv
        const prayTimes = this.prayTimes.getTimes(date, this.getGPSData(), -3);
        if (this.settings.debug) {
            console.log("Date: ", date);
            console.log("PrayTimes: ", prayTimes);
        }

        let i = 0;
        const showAstrEvents = this.showAstronomicEvents;

        for (const timeType in PrayTimes.timeNames) {
            if (PrayTimes.timeNames.hasOwnProperty(timeType)) {
                const prayTimeFlag: boolean = PrayTimes.PRAY_TIMES.indexOf(timeType) >= 0;
                const astroTimeFlag: boolean = PrayTimes.ASTRONOMIC_TIMES.indexOf(timeType) >= 0;
                if (prayTimeFlag || (showAstrEvents && astroTimeFlag)) {

                    const prayTimeName: string = prayTimes[timeType];
                    const event: PrayTimeCalendarEvent = this.createEvent(
                        prayTimeName,
                        timeType,
                        prayTimeFlag, astroTimeFlag,
                        date,
                        colors[i]);

                    events.push(event);

                    i++;
                    if (i >= colors.length) i = 0
                }
            }
        }

        return events;
    }

    public createEvent(time: string, timeType: string, prayTimeFlag: boolean, astroTimeFlag: boolean, date: Date, color: Color) {
        const timeName: string = PrayTimes.timeNames[timeType];
        const duration: number = prayTimeFlag ? 20 : 1;
        let type: PrayTimeCalendarEventType = PrayTimeCalendarEventType.UNKNOW;
        if (astroTimeFlag)
            type = PrayTimeCalendarEventType.ASTRONOMIC_EVENT;
        else if (prayTimeFlag)
            type = PrayTimeCalendarEventType.PRAY_EVENT;
        const event: PrayTimeCalendarEvent = new PrayTimeCalendarEvent(timeName, timeName, date, time, duration, this.prayTimes.timeFormat, type, false, color);
        if (this.settings.debug) {
            console.log("Pray Event: ", event);
        }
        return event;
    }

    /*
     * Default my home coordenates: -3.924263,-38.453483
     * @return GpsData
     */
    getGPSData(): GpsData {
        return { "lat": -3.924263, "lng": -38.453483, "elv": 16 }
    }
}
