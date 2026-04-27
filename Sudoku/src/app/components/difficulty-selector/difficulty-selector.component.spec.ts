import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifficultySelectorComponent } from './difficulty-selector.component';

describe('Difficulty Selector', () => {
  let component: DifficultySelectorComponent;
  let fixture: ComponentFixture<DifficultySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DifficultySelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DifficultySelectorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
