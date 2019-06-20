import {
  Component, OnInit, Input, OnChanges, SimpleChanges,
  OnDestroy, EventEmitter, Output, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { switchMap, filter, shareReplay, map, takeUntil, distinctUntilChanged } from 'rxjs/operators';

import { ChartAPIService } from '../services/chart-api.service';
import { SocketService, SocketMessageInterface } from './socket.service';
// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';


@Component({
  selector: 'app-pipe-card',
  templateUrl: './pipe-card.component.html',
  styleUrls: ['./pipe-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // providers: [
  //   {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  //   {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  // ],
})
export class PipeCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() pipe: number;
  @Output() delete: EventEmitter<number> = new EventEmitter();

  private pipe$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  private date$: BehaviorSubject<Date> = new BehaviorSubject(undefined);

  private newData$: Observable<SocketMessageInterface> = this.socketService.data$.pipe(
    filter(data => data && data.pipe === this.pipe)
  );

  date = new FormControl(moment());

  data$: Observable<any> = combineLatest(
    this.pipe$,
    this.date$
  ).pipe(
    filter(([pipe, date]) => !!pipe && !!date),
    switchMap(([pipe, date]) => this.serviceAPI.getPipeData(pipe, date)),
    map(data => data.filter(d => d.hum > 1)),
    shareReplay(1),
  );

  rssiDB$: Observable<number> = this.data$.pipe(
    map(data => data[data.length - 1].tx_res),
    distinctUntilChanged(),
  );

  batteryVolt$: Observable<number> = this.data$.pipe(
    map(data => data[data.length - 1].bat_v),
    distinctUntilChanged(),
  );

  batteryPerc$: Observable<number> = this.batteryVolt$.pipe(
    map(batteryVolt => Math.round(((batteryVolt - 3.5) / (4.7 - 3.5)) * 100))
  );

  private destroy$: Subject<void> = new Subject();

  constructor(
    private serviceAPI: ChartAPIService,
    private socketService: SocketService,
  ) {
  }
  ngOnInit() {

    this.newData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.onUpdate());

    this.date.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.onUpdate());

    this.onUpdate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pipe) {
      this.pipe$.next(this.pipe);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onUpdate() {
    const cDate = new Date(); // this.date.value.toDate(); // new Date();
    this.date$.next(new Date(cDate.getTime() - 6 * 60 * 60 * 1000));
  }

}
