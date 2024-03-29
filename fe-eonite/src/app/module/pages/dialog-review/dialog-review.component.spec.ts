import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReviewComponent } from './dialog-review.component';

describe('DialogReviewComponent', () => {
  let component: DialogReviewComponent;
  let fixture: ComponentFixture<DialogReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
