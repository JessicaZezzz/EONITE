import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionVendorComponent } from './transaction-vendor.component';

describe('TransactionVendorComponent', () => {
  let component: TransactionVendorComponent;
  let fixture: ComponentFixture<TransactionVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
