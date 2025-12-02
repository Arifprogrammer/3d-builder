import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cup } from './cup';

describe('Cup', () => {
  let component: Cup;
  let fixture: ComponentFixture<Cup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
