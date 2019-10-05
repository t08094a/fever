import { Component, OnInit } from '@angular/core';
import { DienstberichtService } from './service/dienstbericht.service';

@Component({
  selector: 'app-dienstbericht',
  templateUrl: './dienstbericht.page.html',
  styleUrls: ['./dienstbericht.page.scss'],
})
export class DienstberichtPage implements OnInit {

  constructor(private dienstberichtService: DienstberichtService) { }

  ngOnInit() {
  }

  public add() {
    console.log('öffne neue page zum Anlegen eines Berichteintrags');
    // todo: öffne neue page zum anlegen
  }
}
