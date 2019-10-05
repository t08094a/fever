import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DienstberichtService {

  constructor() { }

  // public addEvent(newEvent): Observable {
  //   // todo: speichere das Objekt in der DB

  //   this._events.next(this._events.getValue().push(newEvent));

  //   return of();
  // }

  // public deleteEvent(deleted): Observable {
  //   // todo: lösche das Objekt aus der DB

  //   let evts = this._events.getValue();
  //   let index = evts.findIndex((evt) => evt.id === deleted.id);
  //   this._events.next(evts.delete(index));

  //   let obs: Observable = Observable.create();

  //   return obs;
  // }

  public getEvents(): Observable<EventItem[]> {
    return of<EventItem[]>([
      {
        id: 'b5d7e089-e06a-4ad9-aa7b-f7b2f50176de',
        startDate: new Date('2019-02-16T16:00'),
        endDate: new Date('2019-02-16T18:00'),
        title: 'Event1',
        // recurring: new NoneRecurringAppointment(),
        description: 'Event1',
        categories: ['Wehr', 'Jugend'],
        duration: '16.02.2019    16:00 - 18:00 Uhr',
        extract: 'Folgendes passierte ...'
      },
      {
        id: 'a283f7ca-dc1c-476c-a486-329680d152eb',
        startDate: new Date('2019-02-17T16:01'),
        endDate: new Date('2019-02-17T18:00'),
        title: 'Event2',
        // recurring: new NoneRecurringAppointment(),
        description: 'Event2',
        categories: ['Einsatz'],
        duration: '16.02.2019    16:00 - 18:00 Uhr',
        extract: 'Folgendes passierte ...'
      }
    ]);
  }
}

export interface EventItem {
  id: string;
  startDate: Date;
  endDate: Date;
  title: string;
  description: string;
  extract: string;
  categories: string[];
  duration: string;
}

class Event {
  // tslint:disable:variable-name
  private _startDate: Date = new Date();
  private _endDate: Date = new Date();
  // public startTime: Time = {hours: 18, minutes: 0};
  // public endTime: Time = {hours: 20, minutes: 0};
  public recurring: RecurringAppointment = null;
  public existPhotos: false;
  private _title: string;
  public description: string;
  public categories: string[] = [];
  public getDuration(): number {
    if (!this.startDate || !this.endDate) {
      console.warn('Not all start or end dates / times are set');
      return 0;
    }

    if (this.recurring && this.recurring.recurringType !== RecurringAppointmentType.None) {

    } else {
      let duration = this._endDate.valueOf() - this._startDate.valueOf();

      // take out milliseconds and seconds
      duration = duration / 1000 / 60;

      const minutes = Math.floor(duration % 60);
      duration = duration / 60;

      const hours = Math.floor(duration % 24);
      const days = Math.floor(duration / 24);
    }

    return 0;
  }

  get startDate(): Date {
    return this._startDate;
  }

  set startDate(date: Date) {
    if (date && this._endDate && date.valueOf() > this._endDate.valueOf()) {
      return;
    }

    this._startDate = date;
  }

  get endDate(): Date {
    return this._endDate;
  }

  set endDate(date: Date) {
    if (date && this._startDate && this._startDate.valueOf() > date.valueOf()) {
      return;
    }

    this._endDate = date;
  }

  get title(): string {
    return this._title;
  }

  set title(newTitle: string) {
    if (newTitle && newTitle.length > 3) {
      this._title = newTitle;
    }
  }
}

interface RecurringAppointment {
  readonly recurringType: RecurringAppointmentType;
  repeatEvery: number;

}

class NoneRecurringAppointment implements RecurringAppointment {
  public readonly recurringType: RecurringAppointmentType.None;
  public repeatEvery = 0;
}

class DailyRecurringAppointment implements RecurringAppointment {
  public readonly recurringType: RecurringAppointmentType.Daily;
  public repeatEvery = 1;
}

class WeeklyRecurringAppointment implements RecurringAppointment {
  public readonly recurringType: RecurringAppointmentType.Weekly;
  public repeatEvery = 1;
}

enum RecurringAppointmentType {
  None,
  Daily,
  Weekly
}
