import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVendorComponent } from './detail-vendor.component';

describe('DetailVendorComponent', () => {
  let component: DetailVendorComponent;
  let fixture: ComponentFixture<DetailVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
