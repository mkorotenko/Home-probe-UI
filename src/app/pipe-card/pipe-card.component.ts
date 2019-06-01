import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { switchMap, filter, shareReplay, map, takeUntil } from 'rxjs/operators';

import { ChartAPIService } from '../services/chart-api.service';
import { SocketService, SocketMessageInterface } from './socket.service';

@Component({
  selector: 'app-pipe-card',
  templateUrl: './pipe-card.component.html',
  styleUrls: ['./pipe-card.component.scss']
})
export class PipeCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() pipe: number;
  @Output() delete: EventEmitter<number> = new EventEmitter();

  private pipe$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  private date$: BehaviorSubject<Date> = new BehaviorSubject(undefined);

  private newData$: Observable<SocketMessageInterface> = this.socketService.data$.pipe(
    filter(data => data && data.pipe === this.pipe)
  )

  data$: Observable<any> = combineLatest(
    this.pipe$,
    this.date$
  ).pipe(
    filter(([pipe, date]) => !!pipe && !!date),
    switchMap(([pipe, date]) => this.serviceAPI.getPipeData(pipe, date)),
    map(data => data.filter(d => d.hum > 1)),
    shareReplay(1),
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
    const cDate = new Date();
    this.date$.next(new Date(cDate.getTime() - 6 * 60 * 60 * 1000));
  }

}
