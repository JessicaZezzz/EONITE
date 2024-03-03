import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserVendorComponent } from './login-user-vendor.component';

describe('LoginUserVendorComponent', () => {
  let component: LoginUserVendorComponent;
  let fixture: ComponentFixture<LoginUserVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginUserVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUserVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
