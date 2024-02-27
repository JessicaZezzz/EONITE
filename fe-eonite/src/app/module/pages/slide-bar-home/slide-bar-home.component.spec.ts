import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideBarHomeComponent } from './slide-bar-home.component';

describe('SlideBarHomeComponent', () => {
  let component: SlideBarHomeComponent;
  let fixture: ComponentFixture<SlideBarHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideBarHomeComponent]
    });
    fixture = TestBed.createComponent(SlideBarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
