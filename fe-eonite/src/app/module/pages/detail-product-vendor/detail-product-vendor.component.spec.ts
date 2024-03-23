import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductVendorComponent } from './detail-product-vendor.component';

describe('DetailProductVendorComponent', () => {
  let component: DetailProductVendorComponent;
  let fixture: ComponentFixture<DetailProductVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailProductVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProductVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
