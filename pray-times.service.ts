import { Injectable, OnInit } from '@angular/core';

import { CalendarEvent } from 'nativescript-ui-calendar';

import { SettingsService } from '../services/settings.service';
import { PrayTimes } from './utils/praytimes';
import { Color } from 'tns-core-modules/color/color';
import { GpsData } from './utils/gps-data';

@Injectable({
    providedIn: 'root'
})
export class PrayTimesService {
    private prayTimes: PrayTimes;

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
        let prayTimesMethod = this.settings.prayTimesMethod;
        if (this.settings.debug) console.log("Pray Times Method:", prayTimesMethod);
        this.prayTimes = new PrayTimes(prayTimesMethod);
        if (this.settings.debug) console.log("PrayTimes Services Init!");

        if (this.settings.debug) {
            console.log("Metodo: ", this.prayTimes.getMethod());
        }
    }
    getTimes(date: Date = new Date()): Array<CalendarEvent> {
        if (this.settings.debug) console.log("get times: ", date);

        const colors: Array<Color> = [new Color(200, 188, 26, 214), new Color(220, 255, 109, 130), new Color(255, 55, 45, 255), new Color(199, 17, 227, 10), new Color(255, 255, 54, 3)];

        const events: Array<CalendarEvent> = new Array<CalendarEvent>();

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

        for (const key in PrayTimes.timeNames) {
            if (PrayTimes.timeNames.hasOwnProperty(key)) {
                const pray: string = prayTimes[key];
                const prayName = PrayTimes.timeNames[key];

                const year = date.getFullYear();
                const month = date.getMonth();
                const day: number = date.getDate();
                const hour: number = parseInt(pray.split(":")[0]);
                const minute: number = parseInt(pray.split(":")[1]);


                const startDate = new Date(year, month, day, hour, minute);
                const endDate = new Date(year, month, day, hour, minute + 10);
                if (this.settings.debug) {
                    console.log("Pray: ", prayName);
                    console.log("Hour: ", hour);
                    console.log("Minute: ", minute);
                    console.log("Start Date: ", startDate);
                    console.log("End DAte: ", endDate);
                }
                const event: CalendarEvent = new CalendarEvent(prayName, startDate, endDate, false, colors[i]);
                if (this.settings.debug) {
                    console.log("Pray Event: ", event);
                }
                events.push(event);

                i++;
            }
        }

        return events;
    }

    /*
     * Default my home coordenates: -3.924263,-38.453483
     * @return GpsData
     */
    getGPSData(): GpsData {
        return { "lat": -3.924263, "lng": -38.453483, "elv": 16 }
    }
}
