import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auberge } from './auberge';

describe('Auberge', () => {
  let component: Auberge;
  let fixture: ComponentFixture<Auberge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auberge],
    }).compileComponents();

    fixture = TestBed.createComponent(Auberge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
