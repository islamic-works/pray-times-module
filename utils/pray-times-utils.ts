export const DEFAULT_TIME_SUFIXES: string[] = ['am', 'pm'];
export const invalidTime: string = '-----';
/*
* convert float time to the given format (see timeFormats)
*/
export function getFormattedTime(time: number, format: string, suffixes?: string[]): string {
   if (isNaN(time))
       return invalidTime;
   if (format == 'Float') return (time as unknown) as string;
   suffixes = suffixes || DEFAULT_TIME_SUFIXES;

   time = DMath.fixHour(time + 0.5 / 60);  // add 0.5 minutes to round
   var hours = Math.floor(time);
   var minutes = Math.floor((time - hours) * 60);
   var suffix = (format == TimeFormat.H12) ? suffixes[hours < 12 ? 0 : 1] : '';
   var hour = (format == TimeFormat.H24) ? (hours as unknown as string).toString().padStart(2, '0') : ((hours + 12 - 1) % 12 + 1);
   return hour + ':' + (minutes as unknown as string).toString().padStart(2, '0') + (suffix ? ' ' + suffix : '');
}

//---------------------- Degree-Based Math Class -----------------------
export class DMath {
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