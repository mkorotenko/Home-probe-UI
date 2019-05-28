import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, filter, shareReplay, map } from 'rxjs/operators';

import { ChartAPIService } from '../chart-api.service';

@Component({
  selector: 'app-pipe-card',
  templateUrl: './pipe-card.component.html',
  styleUrls: ['./pipe-card.component.scss']
})
export class PipeCardComponent implements OnInit, OnChanges {

  @Input() pipe: number;

  private pipe$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  data$: Observable<any> = this.pipe$.pipe(
    filter(pipe => !!pipe),
    switchMap(pipe => this.serviceAPI.getPipeData(pipe, new Date('2019-05-27T18:30:32.665Z'))),
    map(data => data.filter(d => d.hum > 1)),
    shareReplay(1),
  );

  constructor(
    private serviceAPI: ChartAPIService
  ) {
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pipe) {
      this.pipe$.next(this.pipe);
    }
  }

}
