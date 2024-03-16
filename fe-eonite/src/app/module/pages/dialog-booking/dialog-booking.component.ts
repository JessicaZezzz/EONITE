import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-dialog-booking',
  templateUrl: './dialog-booking.component.html',
  styleUrls: ['./dialog-booking.component.css']
})
export class DialogBookingComponent implements OnInit {
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public qty = 1;
  public display = false;
  public model = [
    new Date('7/15/1966'),
    new Date('3/23/1968'),
    new Date('7/4/1992'),
    new Date('1/25/1994'),
    new Date('6/17/1998')
  ];

  @Output() openCart = new EventEmitter<boolean>();
  @ViewChild('picker', { static: true }) _picker?: MatDatepicker<Date>;

  constructor() { }

  ngOnInit(): void {
  }

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return [ 'selected' ];
    }
    return [ ];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker!.close;
        this._picker!.close = () => { };
        this._picker!['_componentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker!.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }

  add(){
    this.qty++;
  }

  min(){
    if(this.qty != 1) this.qty--;
  }

  close(){
    this.openCart.emit(false);
  }

  submitCart(){
    // add to cart endpoint
    this.display = true;
  }
}
