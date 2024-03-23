import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCartComponent } from './dialog-edit-cart.component';

describe('DialogEditCartComponent', () => {
  let component: DialogEditCartComponent;
  let fixture: ComponentFixture<DialogEditCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
