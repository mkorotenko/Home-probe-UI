import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as nv from 'nvd3';
import * as d3 from 'd3';
import { ChartAPIService } from '../chart-api.service';

// const stub = [{"_id":"5cebc68fc5decf2b4c5462c1","temp":25.2,"hum":48.2,"date":"2019-05-27T14:14:36.000Z","serverDate":"2019-05-27T11:14:22.703Z","pipe":3,"tx_res":-88,"bat_v":4.57},{"_id":"5cebc6cbc5decf2b4c5462c3","temp":8.3,"hum":0.5,"date":"2019-05-27T14:15:36.000Z","serverDate":"2019-05-27T11:15:22.701Z","pipe":3,"tx_res":-87,"bat_v":4.57},{"_id":"5cebc707c5decf2b4c5462c5","temp":25,"hum":47.3,"date":"2019-05-27T14:16:36.000Z","serverDate":"2019-05-27T11:16:22.698Z","pipe":3,"tx_res":-85,"bat_v":4.56},{"_id":"5cebc7f7c5decf2b4c5462c9","temp":24.9,"hum":51.5,"date":"2019-05-27T14:20:36.000Z","serverDate":"2019-05-27T11:20:22.685Z","pipe":3,"tx_res":-85,"bat_v":4.56},{"_id":"5cebc8e7c5decf2b4c5462cd","temp":8.4,"hum":0.5,"date":"2019-05-27T14:24:36.000Z","serverDate":"2019-05-27T11:24:22.671Z","pipe":3,"tx_res":-86,"bat_v":4.56},{"_id":"5cebc923c5decf2b4c5462cf","temp":8.4,"hum":0.5,"date":"2019-05-27T14:25:36.000Z","serverDate":"2019-05-27T11:25:22.668Z","pipe":3,"tx_res":-83,"bat_v":4.56},{"_id":"5cebca4fc5decf2b4c5462d5","temp":25,"hum":47.2,"date":"2019-05-27T14:30:36.000Z","serverDate":"2019-05-27T11:30:22.653Z","pipe":3,"tx_res":-85,"bat_v":4.56},{"_id":"5cebca8bc5decf2b4c5462d7","temp":8.3,"hum":0.5,"date":"2019-05-27T14:31:36.000Z","serverDate":"2019-05-27T11:31:22.649Z","pipe":3,"tx_res":-85,"bat_v":4.56},{"_id":"5cebcb7bc5decf2b4c5462db","temp":25.3,"hum":47.1,"date":"2019-05-27T14:35:36.000Z","serverDate":"2019-05-27T11:35:22.636Z","pipe":3,"tx_res":-86,"bat_v":4.56},{"_id":"5cebcbf3c5decf2b4c5462de","temp":25.4,"hum":47.6,"date":"2019-05-27T14:37:36.000Z","serverDate":"2019-05-27T11:37:22.629Z","pipe":3,"tx_res":-86,"bat_v":4.56}];

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') chartEl: ElementRef;

  @Input() data: any[];

  private chart: any;

  ngOnInit() {
    // const chartEl = this.chartEl.nativeElement;
    const formatter = (d) => d3['time'].format('%H:%M')(new Date(d));

    nv.addGraph(() => {
      this.chart = nv.models.lineChart()
        .useInteractiveGuideline(true);

      this.chart.xAxis
        .axisLabel('Time')
        .tickFormat(formatter);

      this.chart.yAxis
        .axisLabel('Values')
        .tickFormat(d3.format('.01f'));

      // const chartData = d3.select(chartEl)
      //   .datum(this.getData(this.getStartDate()));
      // chartData.transition().duration(500)
      //   .call(this.chart);

      nv.utils.windowResize(this.chart.update);
      return this.chart;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && this.chart) {
      const chartEl = this.chartEl.nativeElement;
      const chartData = d3.select(chartEl)
        .datum(this.getData(this.data));
      chartData.transition().duration(500)
        .call(this.chart);
    }
  }

  private getData(probe: any) {
    const Temp: any[] = [];
    const Hum: any[] = [];
    const Volt: any[] = [];

    // const probe = stub;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < probe.length; i++) {
      const date = new Date(probe[i].date.replace('.000Z', '+0300'));
      Temp.push({ x: date, y: probe[i].temp });
      Hum.push({ x: date, y: probe[i].hum });
      Volt.push({ x: date, y: probe[i].bat_v - 0.04 }); // 1.74
    }
    return [
      {
        values: Hum,
        key: 'Hum %',
        color: '#2ca02c'
      },
      {
        values: Temp,
        key: 'Temp C',
        color: '#ff7f0e'
      },
      {
        values: Volt,
        key: 'Bat V',
        color: '#123d9e'
      },
    ];
  }

}
