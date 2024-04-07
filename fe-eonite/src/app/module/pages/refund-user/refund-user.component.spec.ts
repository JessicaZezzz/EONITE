import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundUserComponent } from './refund-user.component';

describe('RefundUserComponent', () => {
  let component: RefundUserComponent;
  let fixture: ComponentFixture<RefundUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
