import { Component, SimpleChanges, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Appointment } from '../appointment.type';
@Component({
  selector: 'app-appointment-detail',
  template: `
  <mat-card>  
  <h2 *ngIf="!isNew">Edit event: '{{appointment?.title}}'</h2>
    
    <h2 *ngIf="isNew">New event</h2>
    <form [formGroup]="form">
      <div class="form-group">
      <mat-form-field class="formfield">
          <input matInput type="text" placeholder="Event Title" formControlName="title"/>
        </mat-form-field>
      </div>
       <br/>
      <button mat-raised-button color="primary" class="addbtn" type="submit" *ngIf="isNew" (click)="onAdd()">Add</button>&nbsp;
      <button mat-raised-button color="primary" class="addbtn" type="submit" *ngIf="!isNew" (click)="onUpdate()">Update</button>&nbsp;
      <button mat-raised-button color="warn" class="cancelBtn" type="button" (click)="close.emit()">Cancel</button>&nbsp;
    </form>
    </mat-card>
  `,
  styleUrls: ['./appointment-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentDetailComponent implements OnChanges {
  @Input() appointment: Appointment;
  @Input() isNew: boolean;
  @Output() close = new EventEmitter();
  @Output() add = new EventEmitter<Appointment>();
  @Output() update = new EventEmitter<Appointment>();
  form = this.formBuilder.group({
    title: [null, Validators.required],
    allDay: [null],
    start: [],
    end: []
  })
  constructor(private formBuilder: FormBuilder) { }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges.appointment && simpleChanges.appointment.currentValue) {
      this.form.patchValue({ ...this.appointment });
    }
  }

  onAdd(): void {
    const { end, start, title, allDay } = this.form.value;
    this.add.emit({ end: end && new Date(end), start: start && new Date(start), title, allDay });
  }

  onUpdate(): void {
    const { end, start, title, allDay, id } = this.form.value;
    this.update.emit({ id: this.appointment.id, end: end && new Date(end), start: start && new Date(start), title, allDay });
  }
}