import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVendorComponent } from './payment-vendor.component';

describe('PaymentVendorComponent', () => {
  let component: PaymentVendorComponent;
  let fixture: ComponentFixture<PaymentVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
