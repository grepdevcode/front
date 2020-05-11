import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-time-picker',
  template: `
  <ngb-timepicker [(ngModel)]="time"> (change)="onChange($event)" </ngb-timepicker>
  <hr>
  <pre>Selected time: {{time | json}}</pre>
  `,
  styles: []
})
export class TimePickerComponent {
  time = {hour: 13, minute: 30};

  // Atención de lunes a domingos de 20:00 a 00:00, y de sábados y domingos de 11:00 a 15:00

  onChange($event) {
    //this.valor.emit($event)
   // this.selectedItem = newValue;  // don't forget to update the model here
    // ... do other stuff here ...
}
}
