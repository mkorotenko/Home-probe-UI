import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, filter, shareReplay, map } from 'rxjs/operators';

import { ChartAPIService } from '../services/chart-api.service';

@Component({
  selector: 'app-pipe-card',
  templateUrl: './pipe-card.component.html',
  styleUrls: ['./pipe-card.component.scss']
})
export class PipeCardComponent implements OnInit, OnChanges {

  @Input() pipe: number;

  @Input() date: Date;

  private pipe$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  private date$: BehaviorSubject<Date> = new BehaviorSubject(undefined);

  data$: Observable<any> = combineLatest(
    this.pipe$,
    this.date$
  ).pipe(
    filter(([pipe, date]) => !!pipe && !!date),
    switchMap(([pipe, date]) => this.serviceAPI.getPipeData(pipe, date)),
    map(data => data.filter(d => d.hum > 1)),
    shareReplay(1),
  );

  constructor(
    private serviceAPI: ChartAPIService
  ) {
  }
  ngOnInit() {
    this.onUpdate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pipe) {
      this.pipe$.next(this.pipe);
    }
    if (changes.date) {
      this.date$.next(this.date);
    }
  }

  onUpdate() {
    const cDate = new Date();
    this.date$.next(new Date(cDate.getTime() - 6 * 60 * 60 * 1000));
  }

}
