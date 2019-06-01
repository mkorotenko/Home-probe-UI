import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { Observable, Subject } from 'rxjs';
import { MatSlideToggleChange, MatDialog } from '@angular/material';
import { SocketService } from '../pipe-card/socket.service';
import { takeUntil } from 'rxjs/operators';
import { EditPipeDialogComponent } from '../edit-pipe-dialog/edit-pipe-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  debug$: Observable<boolean> = this.localStorage.createFlow('debug_mode', false);

  pipeList$: Observable<number[]> = this.localStorage.createFlow('pipe_list', []);

  private destroy$: Subject<void> = new Subject();
  constructor(
    private localStorage: LocalStorageService,
    private socketService: SocketService,
    private dialog: MatDialog
  ) {
  }
  ngOnInit() {
    this.debug$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(debug => this.socketService.setDebugMode(debug));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onDebugModeChange(event: MatSlideToggleChange) {
    this.localStorage.setItem('debug_mode', event.checked);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EditPipeDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
