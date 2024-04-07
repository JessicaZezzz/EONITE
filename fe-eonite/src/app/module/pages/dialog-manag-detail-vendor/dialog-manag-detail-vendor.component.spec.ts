import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogManagDetailVendorComponent } from './dialog-manag-detail-vendor.component';

describe('DialogManagDetailVendorComponent', () => {
  let component: DialogManagDetailVendorComponent;
  let fixture: ComponentFixture<DialogManagDetailVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogManagDetailVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogManagDetailVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
