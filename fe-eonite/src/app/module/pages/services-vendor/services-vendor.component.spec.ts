import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesVendorComponent } from './services-vendor.component';

describe('ServicesVendorComponent', () => {
  let component: ServicesVendorComponent;
  let fixture: ComponentFixture<ServicesVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
