import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

export interface SocketMessageInterface {
  pipe: number;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  client = io(environment.socketServer);

  private dataSource$: BehaviorSubject<SocketMessageInterface> = new BehaviorSubject(undefined);
  data$: Observable<SocketMessageInterface> = this.dataSource$.asObservable();

  constructor() {
    this.client.on('newData', data => this.dataSource$.next(data));
  }

  setDebugMode(debug: boolean) {
    this.client.emit('debugMode', debug);
  }
}
