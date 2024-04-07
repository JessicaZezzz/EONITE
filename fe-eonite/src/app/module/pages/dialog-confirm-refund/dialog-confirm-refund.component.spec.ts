import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmRefundComponent } from './dialog-confirm-refund.component';

describe('DialogConfirmRefundComponent', () => {
  let component: DialogConfirmRefundComponent;
  let fixture: ComponentFixture<DialogConfirmRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
