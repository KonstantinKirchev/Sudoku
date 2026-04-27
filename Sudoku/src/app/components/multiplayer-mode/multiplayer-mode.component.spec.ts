import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlayerComponent } from './multiplayer-mode.component';

describe('Multi Player Mode', () => {
  let component: MultiPlayerComponent;
  let fixture: ComponentFixture<MultiPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiPlayerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
