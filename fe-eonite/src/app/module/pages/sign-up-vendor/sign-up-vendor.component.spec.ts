import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpVendorComponent } from './sign-up-vendor.component';

describe('SignUpVendorComponent', () => {
  let component: SignUpVendorComponent;
  let fixture: ComponentFixture<SignUpVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpVendorComponent]
    });
    fixture = TestBed.createComponent(SignUpVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
