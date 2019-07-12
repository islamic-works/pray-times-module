import { Component, OnInit } from '@angular/core';
import { PrayTimesService } from '../pray-times.service';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-pray-times-calendar',
  templateUrl: './pray-times-calendar.component.html',
  styleUrls: ['./pray-times-calendar.component.scss'],
  moduleId: module.id,
})
export class PrayTimesCalendarComponent implements OnInit {

  active: string;

  constructor(private page: Page, private prayTimes: PrayTimesService) { }

  ngOnInit() {

    this.active = "glossary";
    this.page.actionBarHidden = true;
    console.log("PrayTimesCalendar Component Init!");
  }

  public get times(): any {
    let times = this.prayTimes.getTimes();
    console.log(times);

    return times;
  }
}
