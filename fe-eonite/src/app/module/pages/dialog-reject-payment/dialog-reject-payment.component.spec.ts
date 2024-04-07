import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRejectPaymentComponent } from './dialog-reject-payment.component';

describe('DialogRejectPaymentComponent', () => {
  let component: DialogRejectPaymentComponent;
  let fixture: ComponentFixture<DialogRejectPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRejectPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRejectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
