import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBookingComponent } from './dialog-booking.component';

describe('DialogBookingComponent', () => {
  let component: DialogBookingComponent;
  let fixture: ComponentFixture<DialogBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
