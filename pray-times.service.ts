import { Injectable, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { PrayTimes } from './utils/praytimes';

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
  }

  getTimes(date: Date = new Date()): any {
    if (this.settings.debug) console.log("get times: ", date);
    /*
      Latitude  : - 3.7167, 
      Longitude : -38.5 
      Distance  : 10595 km 
      Qibla Direction 36.25° from East toward North
     */
    // lat, lng, elv
    return this.prayTimes.getTimes(date, [-3.7167, -38.5, 16], -3);
  }
}
