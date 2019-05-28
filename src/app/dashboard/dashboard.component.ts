import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartAPIService } from '../chart-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data$: Observable<any> = this.serviceAPI.getPipeData(3, new Date('2019-05-27T18:30:32.665Z'));
  constructor(
    private serviceAPI: ChartAPIService
  ) {
  }

  ngOnInit() {
  }

}
