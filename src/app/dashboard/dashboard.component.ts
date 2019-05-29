import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  debug$: Observable<boolean> = this.localStorage.createFlow('debug_mode', false);
  constructor(
    private localStorage: LocalStorageService
  ) {
  }
  ngOnInit() {
  }

  onDebugModeChange(event: MatSlideToggleChange) {
    this.localStorage.setItem('debug_mode', event.checked);
  }
}
