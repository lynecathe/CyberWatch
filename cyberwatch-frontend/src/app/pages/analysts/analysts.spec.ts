import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analysts } from './analysts';

describe('Analysts', () => {
  let component: Analysts;
  let fixture: ComponentFixture<Analysts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analysts],
    }).compileComponents();

    fixture = TestBed.createComponent(Analysts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
