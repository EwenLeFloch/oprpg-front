import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Combat } from './combat';

describe('Combat', () => {
  let component: Combat;
  let fixture: ComponentFixture<Combat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Combat],
    }).compileComponents();

    fixture = TestBed.createComponent(Combat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
