import { GpsData } from "./gps-data";
import { PrayTimesEvents as PrayTimesInfo } from "./pray-times-info";
import { PrayTaimesSettings as PrayTimesSettings } from "./pray-times-settings";
import { SunPosition } from "./sun-position";

//--------------------- Copyright Block ----------------------
/*

PrayTimes.ts: Prayer Times Calculator (Ver 4.0)
Developer: Carlos Delfino <consultoria@carlosdelfino.eti.br>

PrayTimes.js: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
	Permission is granted to use this code, with or
	without modification, in any website or application
	provided that credit is given to the original work
	with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

http://praytimes.org/code/git/?a=viewblob&p=PrayTimes&h=ab1c60335ec59683f2097d1876172b1dd784e36d&hb=HEAD&f=v2/js/PrayTimes.js
*/


//--------------------- Help and Manual ----------------------
/*

User's Manual:
http://praytimes.org/manual

Calculation Formulas:
http://praytimes.org/calculation



//------------------------ User Interface -------------------------


	getTimes (date, coordinates [, timeZone [, dst [, timeFormat]]])

	setMethod (method)       // set calculation method
	adjust (parameters)      // adjust calculation parameters
	tune (offsets)           // tune times by given offsets

	getMethod ()             // get calculation method
	getSetting ()            // get current calculation parameters
	getOffsets ()            // get current time offsets


//------------------------- Sample Usage --------------------------


	var PT = new PrayTimes('ISNA');
	var times = PT.getTimes(new Date(), [43, -80], -5);
	document.write('Sunrise = '+ times.sunrise)


*/


//----------------------- PrayTimes Class ------------------------
export class PrayTimes {

    //------------------------ Constants --------------------------

    // Time Names
    public static readonly timeNames = {
        imsak: 'Imsak',
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        sunset: 'Sunset',
        maghrib: 'Maghrib',
        isha: 'Isha',
        midnight: 'Midnight'
    };
    public static readonly PRAY_TIMES:string[] = [
        "fajr",
        "dhuhr",
        "asr",
        "maghrib",
        "isha"];

    // Calculation Methods
    public static readonly methods = {
        MWL: {
            name: 'Muslim World League',
            params: { fajr: 18, isha: 17 }
        },
        ISNA: {
            name: 'Islamic Society of North America (ISNA)',
            params: { fajr: 15, isha: 15 }
        },
        Egypt: {
            name: 'Egyptian General Authority of Survey',
            params: { fajr: 19.5, isha: 17.5 }
        },
        Makkah: {
            name: 'Umm Al-Qura University, Makkah',
            params: { fajr: 18.5, isha: '90 min' }
        },  // fajr was 19 degrees before 1430 hijri
        Karachi: {
            name: 'University of Islamic Sciences, Karachi',
            params: { fajr: 18, isha: 18 }
        },
        Tehran: {
            name: 'Institute of Geophysics, University of Tehran',
            params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' }
        },  // isha is not explicitly specified in this method
        Jafari: {
            name: 'Shia Ithna-Ashari, Leva Institute, Qum',
            params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' }
        }
    };

    // Default Parameters in Calculation Methods
    static readonly defaultParams = {
        maghrib: '0 min', midnight: 'Standard'
    };


    //----------------------- Parameter Values ----------------------
	/*

	// Asr Juristic Methods
	asrJuristics = [
		'Standard',    // Shafi`i, Maliki, Ja`fari, Hanbali
		'Hanafi'       // Hanafi
	],


	// Midnight Mode
	midnightMethods = [
		'Standard',    // Mid Sunset to Sunrise
		'Jafari'       // Mid Sunset to Fajr
	],


	// Adjust Methods for Higher Latitudes
	highLatMethods = [
		'NightMiddle', // middle of night
		'AngleBased',  // angle/60th of night
		'OneSeventh',  // 1/7th of night
		'None'         // No adjustment
	],


	*/


    //---------------------- Default Settings --------------------

    calcMethod: string = 'MWL';

    // do not change anything here; use adjust method instead
    setting: PrayTimesSettings = {
        imsak: '10 min',
        dhuhr: '0 min',
        asr: 'Standard',
        highLats: 'NightMiddle',
        midnight: null,
        maghrib: null,
        isha: null,
        fajr: null
    };



    timeFormat: TimeFormat = TimeFormat.H24;

    static readonly DEFAULT_TIME_SUFIXES: string[] = ['am', 'pm'];
    static readonly invalidTime: string = '-----';

    numIterations: number = 1;
    offset: PrayTimesInfo = {};


    //----------------------- Local Variables ---------------------

    coord: GpsData; // coordinates
    timeZone: number; jDate: number;     // time variables


    defParams;
    //---------------------- Initialization -----------------------

    constructor(method: string) {
        // set methods defaults
        this.defParams = PrayTimes.defaultParams;
        for (let i in PrayTimes.methods) {
            let params: PrayTimesInfo = PrayTimes.methods[i].params;
            for (let j in this.defParams)
                if ((typeof (params[j]) == 'undefined'))
                    params[j] = this.defParams[j];
        };

        // initialize settings
        this.calcMethod = PrayTimes.methods[method] ? method : this.calcMethod;
        let params: PrayTimesInfo = PrayTimes.methods[this.calcMethod].params;
        for (let id in params)
            this.setting[id] = params[id];

        // init time offsets
        for (let i in PrayTimes.timeNames)
            this.offset[i] = 0;
    }

    //----------------------- Public Functions ------------------------

	/**
	 * set calculation method
	 */
    setMethod(method: string) {
        if (PrayTimes.methods[method]) {
            this.adjust(PrayTimes.methods[method].params);
            this.calcMethod = method;
        }
    }

	/**
	 * set calculating parameters
	 */
    adjust(params: PrayTimesInfo) {
        for (let id in params)
            this.setting[id] = params[id];
    }

	/**
	 *  set time offsets
 	 */
    tune(timeOffsets: PrayTimesInfo) {
        for (var i in timeOffsets)
            this.offset[i] = timeOffsets[i];
    }


	/**
	 *  get current calculation method
	 */
    getMethod(): string { return this.calcMethod; }

	/**
	 *  get current setting
	 */
    getSetting(): PrayTimesSettings { return this.setting; }

    // get current time offsets
    getOffsets(): PrayTimesInfo { return this.offset; }

    // get default calc parametrs
    getDefaults() { return PrayTimes.methods; }


	/**
	 *  return prayer times for a given date
	 * @param date  Data no formato Date ou um array numérico no formato [ano, mês, dia]
	 * @param coords um Array Numérico ou um objeto no formato {lat,lng,elv}
	 * @param timezone timze zone no formato numérico com o offset do tempo ou a string auto
	 *
	 */
    getTimes(date: Date | number[], coords: number[] | GpsData, timezone: number | "auto" = "auto", dst: boolean | "auto" = "auto", format: TimeFormat = TimeFormat.H24): PrayTimesInfo {
 
        if (Array.isArray(coords)) {
            this.coord = {
                "lat": coords[0], "lng": coords[1],
                "elv": (coords[2] ? coords[2] : 0)
            }
        } else {
            this.coord = coords;
        }
        this.timeFormat = format || this.timeFormat;
        if (date.constructor === Date) { 
            date = [(date as Date).getFullYear(),
            (date as Date).getMonth() + 1,
            (date as Date).getDate()];
        }

        if (typeof (timezone) == 'undefined' || timezone == 'auto')
            timezone = this.getTimeZone(date as []);

        if (typeof (dst) == 'undefined' || dst == 'auto')
            dst = this.getDst(date as []);

        this.timeZone = timezone + (dst ? 1 : 0);
 
        this.jDate = this.julian(date[0], date[1], date[2]) - this.coord.lng / (15 * 24);
 
        return this.computeTimes();
    }

	/*
	 * convert float time to the given format (see timeFormats)
	 */
    getFormattedTime(time: number, format: string, suffixes?: string[]): string {
        if (isNaN(time))
            return PrayTimes.invalidTime;
        if (format == 'Float') return (time as unknown) as string;
        suffixes = suffixes || PrayTimes.DEFAULT_TIME_SUFIXES;

        time = DMath.fixHour(time + 0.5 / 60);  // add 0.5 minutes to round
        var hours = Math.floor(time);
        var minutes = Math.floor((time - hours) * 60);
        var suffix = (format == TimeFormat.H12) ? suffixes[hours < 12 ? 0 : 1] : '';
        var hour = (format == TimeFormat.H24) ? (hours as unknown as string).toString().padStart(2, '0') : ((hours + 12 - 1) % 12 + 1);
        return hour + ':' + (minutes as unknown as string).toString().padStart(2, '0') + (suffix ? ' ' + suffix : '');
    }


    //---------------------- Calculation Functions -----------------------

	/*
	 * compute mid-day time
	 */
    midDay(time: number): number {
        let eqt: number = this.sunPosition(this.jDate + time).equation;
        let noon: number = DMath.fixHour(12 - eqt);
        return noon;
    }

	/*
	 * compute the time at which sun reaches a specific angle below horizon
	 */
    sunAngleTime(angle: number, time: number, direction?: 'ccw' | 'cw'): number {
        let decl = this.sunPosition(this.jDate + time).declination;
        let noon = this.midDay(time);
        let t = 1 / 15 * DMath.arccos((-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.coord.lat)) /
            (DMath.cos(decl) * DMath.cos(this.coord.lat)));
        return noon + (direction == 'ccw' ? -t : t);
    }

	/*
	 * compute asr time
	 */
    asrTime(factor: number, time: number) {
        var decl: number = this.sunPosition(this.jDate + time).declination;
        var angle: number = -DMath.arccot(factor + DMath.tan(Math.abs(this.coord.lat - decl)));
        return this.sunAngleTime(angle, time);
    }

	/**
	 * compute declination angle of sun and equation of time
	 * Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
	 */
    sunPosition(jd: number): SunPosition {
        let D = jd - 2451545.0;
        let g = DMath.fixAngle(357.529 + 0.98560028 * D);
        let q = DMath.fixAngle(280.459 + 0.98564736 * D);
        let L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.020 * DMath.sin(2 * g));

        let R = 1.00014 - 0.01671 * DMath.cos(g) - 0.00014 * DMath.cos(2 * g);
        let e = 23.439 - 0.00000036 * D;

        let RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
        let eqt = q / 15 - DMath.fixHour(RA);
        let decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

        return { declination: decl, equation: eqt };
    }

	/**
	 *  convert Gregorian date to Julian day
	 *  Ref: Astronomical Algorithms by Jean Meeus
	 */
    julian(year: number, month: number, day: number): number {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        let A = Math.floor(year / 100);
        let B = 2 - A + Math.floor(A / 4);

        let JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
        return JD;
    }


    //---------------------- Compute Prayer Times -----------------------


    /*
     * compute prayer times at given julian date
     */
    computePrayerTimes(times: PrayTimesInfo): PrayTimesInfo {
        times = this.dayPortion(times); 

        let params = this.setting;

        let imsak = this.sunAngleTime(this.eval(params.imsak), times.imsak as number, 'ccw');
        let fajr = this.sunAngleTime(this.eval(params.fajr), times.fajr as number, 'ccw');
        let sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise as number, 'ccw');
        let dhuhr = this.midDay(times.dhuhr as number);
        let asr = this.asrTime(this.asrFactor(params.asr), times.asr as number);
        let sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset as number);
        let maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib as number);
        let isha = this.sunAngleTime(this.eval(params.isha), times.isha as number);

        return {
            imsak, fajr, sunrise, dhuhr,
            asr, sunset, maghrib, isha,
            midnight: null
        };
    }

	/**
	 * compute prayer times
	 */
    computeTimes(): PrayTimesInfo {
        // default times
        let times: PrayTimesInfo = {
            imsak: 5, fajr: 5, sunrise: 6, dhuhr: 12,
            asr: 13, sunset: 18, maghrib: 18, isha: 18,
            midnight: null
        }

        // main iterations
        for (var i = 1; i <= this.numIterations; i++)
            times = this.computePrayerTimes(times);

        times = this.adjustTimes(times);

        // add midnight time
        times.midnight = (this.setting.midnight == 'Jafari') ?
            (times.sunset as number) + this.timeDiff(times.sunset as number, times.fajr as number) / 2 :
            times.sunset as number + this.timeDiff(times.sunset as number, times.sunrise as number) / 2;

        times = this.tuneTimes(times);
        return this.modifyFormats(times);
    }

	/**
	 * adjust times
	 */
    adjustTimes(times: PrayTimesInfo): PrayTimesInfo {
        var params = this.setting;
        for (var i in times)
            times[i] += this.timeZone - this.coord.lng / 15;

        if (params.highLats != 'None')
            times = this.adjustHighLats(times);

        if (this.isMin(params.imsak))
            times.imsak = times.fajr as number - this.eval(params.imsak) / 60;
        if (this.isMin(params.maghrib))
            times.maghrib = times.sunset as number + this.eval(params.maghrib) / 60;
        if (this.isMin(params.isha))
            times.isha = times.maghrib as number + this.eval(params.isha) / 60;
        (times.dhuhr as number) += this.eval(params.dhuhr) / 60;

        return times;
    }

    // get asr shadow factor
    asrFactor(asrParam) {
        let factor = { Standard: 1, Hanafi: 2 }[asrParam];
        return factor || this.eval(asrParam);
    }

	/**
	 * return sun angle for sunset/sunrise
	 */
    riseSetAngle(): number {
        //var earthRad = 6371009; // in meters
        //var angle = DMath.arccos(earthRad/(earthRad+ elv));
        let angle = 0.0347 * Math.sqrt(this.coord.elv); // an approximation
        return 0.833 + angle;
    }

	/**
	 * apply offsets to the times
	 */
    tuneTimes(times: PrayTimesInfo): PrayTimesInfo {
        for (var i in times)
            times[i] += this.offset[i] / 60;
        return times;
    }

	/**
	 * convert times to given time format
	 */
    modifyFormats(times: PrayTimesInfo): PrayTimesInfo {
        for (var i in times)
            times[i] = this.getFormattedTime(times[i], this.timeFormat);
        return times;
    }

    /*
     * adjust times for locations in higher latitudes
     */
    adjustHighLats(times: PrayTimesInfo): PrayTimesInfo {
        let params = this.setting;
        var nightTime = this.timeDiff(times.sunset as number, times.sunrise as number);

        times.imsak = this.adjustHLTime(times.imsak as number, times.sunrise as number, this.eval(params.imsak), nightTime, 'ccw');
        times.fajr = this.adjustHLTime(times.fajr as number, times.sunrise as number, this.eval(params.fajr), nightTime, 'ccw');
        times.isha = this.adjustHLTime(times.isha as number, times.sunset as number, this.eval(params.isha), nightTime);
        times.maghrib = this.adjustHLTime(times.maghrib as number, times.sunset as number, this.eval(params.maghrib), nightTime);

        return times;
    }

	/**
	 * adjust a time for higher latitudes
	 */
    adjustHLTime(time: number, base: number, angle: number, night: number, direction?: string): number {
        let portion = this.nightPortion(angle, night);
        let timeDiff = (direction == 'ccw') ?
            this.timeDiff(time, base) :
            this.timeDiff(base, time);
        if (isNaN(time) || timeDiff > portion)
            time = base + (direction == 'ccw' ? -portion : portion);
        return time;
    }

	/**
	 * the night portion used for adjusting times in higher latitudes
	 */
    nightPortion(angle: number, night: number): number {
        let method: string = this.setting.highLats;
        let portion: number = 1 / 2 // MidNight
        if (method == 'AngleBased')
            portion = 1 / 60 * angle;
        if (method == 'OneSeventh')
            portion = 1 / 7;
        return portion * night;
    }

	/**
	 * convert hours to day portions
	 */
    dayPortion(times: PrayTimesInfo): PrayTimesInfo {
        for (let i in times)
            times[i] /= 24;
        return times;
    }


    //---------------------- Time Zone Functions -----------------------

	/*
	 * get local time zone
	 */
    getTimeZone(date: number[]): number {
        let year = date[0];
        let t1 = this.gmtOffset([year, 0, 1]);
        let t2 = this.gmtOffset([year, 6, 1]);
        return Math.min(t1, t2);
    }

	/**
	 * get daylight saving for a given date
	 */
    getDst(date: number[]): boolean {
        return this.gmtOffset(date) != this.getTimeZone(date);
    }

	/**
	 * GMT offset for a given date
	 */
    gmtOffset(date: number[]): number {
        let localDate: Date = new Date(date[0], date[1] - 1, date[2], 12, 0, 0, 0);
        let GMTString: string = localDate.toUTCString();
        let GMTDate: Date = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ') - 1));
        let hoursDiff: number = (localDate.getTime() - GMTDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff;
    }

    //---------------------- Misc Functions -----------------------

	/*
     * convert given string into a number
     *
     * Convert a time like 13h in 13 or 50m in 50
	 */
    eval(str: string | number): number {
        return parseInt(new String(str).toString());
        //		return ((str as unknown) as string).split(/[^0-9.+-]/)[0] as unknown as number;
    }

    // detect if input contains 'min'
    isMin(arg: string): boolean {
        return (arg + '').indexOf('min') != -1;
    }

    // compute the difference between two times
    timeDiff(time1: number, time2: number): number {
        return DMath.fixHour(time2 - time1);
    }

}

//---------------------- Degree-Based Math Class -----------------------
class DMath {
    static dtr(d: number): number { return (d * Math.PI) / 180.0; }
    static rtd(r: number): number { return (r * 180.0) / Math.PI; }

    static sin(d: number): number { return Math.sin(DMath.dtr(d)); }
    static cos(d: number): number { return Math.cos(DMath.dtr(d)); }
    static tan(d: number): number { return Math.tan(DMath.dtr(d)); }

    static arcsin(d: number): number { return DMath.rtd(Math.asin(d)); }
    static arccos(d: number): number { return DMath.rtd(Math.acos(d)); }
    static arctan(d: number): number { return DMath.rtd(Math.atan(d)); }

    static arccot(x: number): number { return DMath.rtd(Math.atan(1 / x)); }
    static arctan2(y: number, x: number): number { return DMath.rtd(Math.atan2(y, x)); }

    static fixAngle(a: number): number { return DMath.fix(a, 360); }
    static fixHour(a: number): number { return DMath.fix(a, 24); }

    static fix(a: number, b: number): number {
        a = a - b * (Math.floor(a / b));
        return (a < 0) ? a + b : a;
    }
}

export 	// Time Formats
    enum TimeFormat {
    H24 = '24h',         // 24-hour format
    H12 = '12h',         // 12-hour format
    hNS12 = '12hNS',       // 12-hour format with no suffix
    FLOAT = 'Float'        // floating point number
}
