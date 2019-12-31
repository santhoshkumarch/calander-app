import { ChangeDetectionStrategy, SimpleChanges, OnChanges, Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Appointment } from '../appointment.type';
import $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';

@Component({
  selector: 'app-calendar',
  template: `
  <div #calendar></div>
  `,
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() viewModes = ['month', 'agendaWeek', 'agendaDay'];
  @Input() navButtons = ['prev', 'next', 'today'];
  @Input() appointments: Appointment[] = [];
  @Output() requestNewAppointment = new EventEmitter<Appointment>();
  @Output() requestUpdateAppointment = new EventEmitter<Appointment>();
  @Output() appointmentUpdated = new EventEmitter<Appointment>();
  @ViewChild('calendar', {static: true}) calendar: ElementRef;
  constructor() { }

  get $Instance(): any {
    return $(this.calendar.nativeElement);
  }

  ngOnDestroy(): void {
    this.$Instance.fullCalendar('destroy');
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.appointments && simpleChanges.appointments.currentValue) {
      this.updateAppointments();
    }
  }

  ngAfterViewInit(): void {
    this.$Instance.fullCalendar({
      selectable: true,
      editable: true,
      eventSources: [{
        events: this.appointments || [],
      }],
      header: {
        left: this.navButtons.join(','),
        center: 'title',
        right: this.viewModes.join(',')
      },
      select: (start: moment.Moment, end: moment.Moment) => {
        this.requestNewAppointment.emit(this.neutralize({ start: start.toDate(), end: end.toDate() }));
      },
      eventClick: (event: Appointment) => {
        this.requestUpdateAppointment.emit(this.neutralize(event));
      },
      eventDrop: (event: Appointment, delta, revert) => {
        this.appointmentUpdated.emit(this.neutralize(event));
      }
    });
  }

  private updateAppointments(): void {
    this.$Instance.fullCalendar('removeEventSources', this.$Instance.fullCalendar('getEventSources'));
    this.$Instance.fullCalendar('addEventSource', { events: this.appointments });
  }

  private neutralize(event: Appointment): Appointment {
    const { start, end, allDay, title, id } = event;
    return { start, end, allDay, title, id };
  }
}