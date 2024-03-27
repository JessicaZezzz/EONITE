import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionVendorDetailsComponent } from './transaction-vendor-details.component';

describe('TransactionVendorDetailsComponent', () => {
  let component: TransactionVendorDetailsComponent;
  let fixture: ComponentFixture<TransactionVendorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionVendorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionVendorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
