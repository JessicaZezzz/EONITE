import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileVendorComponent } from './edit-profile-vendor.component';

describe('EditProfileVendorComponent', () => {
  let component: EditProfileVendorComponent;
  let fixture: ComponentFixture<EditProfileVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
