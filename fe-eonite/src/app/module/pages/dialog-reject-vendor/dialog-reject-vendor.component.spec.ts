import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRejectVendorComponent } from './dialog-reject-vendor.component';

describe('DialogRejectVendorComponent', () => {
  let component: DialogRejectVendorComponent;
  let fixture: ComponentFixture<DialogRejectVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRejectVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRejectVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
