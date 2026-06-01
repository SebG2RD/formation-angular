import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonFavoris } from './pokemon-favoris';

describe('PokemonFavoris', () => {
  let component: PokemonFavoris;
  let fixture: ComponentFixture<PokemonFavoris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonFavoris],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFavoris);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
