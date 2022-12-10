import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameidInputComponent } from './gameid-input.component';

describe('GameidInputComponent', () => {
  let component: GameidInputComponent;
  let fixture: ComponentFixture<GameidInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameidInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameidInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
