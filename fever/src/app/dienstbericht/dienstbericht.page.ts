import { LoadingService } from './../service/loading.service';
import { Component, OnInit } from '@angular/core';
import { DienstberichtService, EventItem } from './service/dienstbericht.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dienstbericht',
  templateUrl: './dienstbericht.page.html',
  styleUrls: ['./dienstbericht.page.scss'],
})
export class DienstberichtPage implements OnInit {

  public events$: Observable<EventItem[]>;

  constructor(private loadingService: LoadingService,
              private dienstberichtService: DienstberichtService) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadingService.present('Loading ...', 5000);

    this.events$ = this.dienstberichtService.getEvents();

    this.dienstberichtService.getEvents().subscribe(
      x => {
        this.loadingService.dismiss();
      },
      err => {
        console.error('Observer got an error: ' + err);
        this.loadingService.dismiss();
      },
      () => console.log('Observer got complete notification')
    );
  }

  public createNewEvent() {
    console.log('öffne neue page zum Anlegen eines Berichteintrags');
    // todo: öffne neue page zum anlegen
  }

  public editEvent(event) {
    console.log('bearbeite Berichteintrag: ' + event.title);
  }
}
