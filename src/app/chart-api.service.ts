import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ChartAPIService {

  constructor(
    private http: HttpClient
  ) { }

  getPipeData(pipe: number, date: Date): Observable<any[]> {
    return this.http.get<any[]>(`docs/${moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z/${pipe}`);
  }
}
