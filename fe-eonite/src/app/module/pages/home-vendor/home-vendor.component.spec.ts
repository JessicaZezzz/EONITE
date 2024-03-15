import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVendorComponent } from './home-vendor.component';

describe('HomeVendorComponent', () => {
  let component: HomeVendorComponent;
  let fixture: ComponentFixture<HomeVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
