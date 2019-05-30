import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  client = io('http://localhost:3000');
  constructor() {
    console.info('sock', this);
  }

  setDebugMode(debug: boolean) {
    this.client.emit('debugMode', debug);
  }
}
