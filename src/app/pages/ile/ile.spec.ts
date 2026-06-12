import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ile } from './ile';

describe('Ile', () => {
  let component: Ile;
  let fixture: ComponentFixture<Ile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ile],
    }).compileComponents();

    fixture = TestBed.createComponent(Ile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
