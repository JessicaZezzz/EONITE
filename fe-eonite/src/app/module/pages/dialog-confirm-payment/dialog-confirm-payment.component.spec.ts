import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmPaymentComponent } from './dialog-confirm-payment.component';

describe('DialogConfirmPaymentComponent', () => {
  let component: DialogConfirmPaymentComponent;
  let fixture: ComponentFixture<DialogConfirmPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
