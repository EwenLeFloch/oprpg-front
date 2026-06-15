import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Faction } from './faction';

describe('Faction', () => {
  let component: Faction;
  let fixture: ComponentFixture<Faction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Faction],
    }).compileComponents();

    fixture = TestBed.createComponent(Faction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
