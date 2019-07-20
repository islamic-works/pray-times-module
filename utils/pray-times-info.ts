/**
 * Objeto para Parametros, Offset e Horários de oração.
 * 
 * Esta interface permite modelar o objeto que se transforma durante o processo de calculo, vindo ao final ser os horários.
 * 
 * Ele pode ser usado como transporte para Parametros, Offset das orações.
 * 
 * Alguns tipos estão reservados para uso futuro.
 */
export interface PrayTimesEvents {
   imsak?: number | string | [] | { h: number, m: number };
   fajr?: number | string | [] | { h: number, m: number };
   sunrise?: number | string | [] | { h: number, m: number };
   dhuhr?: number | string | [] | { h: number, m: number };
   asr?: number | string | [] | { h: number, m: number };
   sunset?: number | string | [] | { h: number, m: number };
   maghrib?: number | string | [] | { h: number, m: number };
   isha?: number | string | [] | { h: number, m: number };
   midnight?: number | string | [] | { h: number, m: number };
}