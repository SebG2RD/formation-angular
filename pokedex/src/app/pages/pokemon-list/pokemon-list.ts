import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonApiService } from '../../services/pokemon-api';
import { PokemonPreview } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
})
export class PokemonListComponent {
  private api = inject(PokemonApiService);
  private readonly pageSize = 18;

  pokemons = signal<PokemonPreview[]>([]);
  recherche = signal('');
  total = signal(0);
  isLoading = signal(false);

  filtres = computed(() => {
    const q = this.recherche().toLowerCase().trim();
    return this.pokemons().filter(p => p.name.includes(q));
  });

  constructor() {
    this.loadMore();
  }

  loadMore() {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const offset = this.pokemons().length;

    this.api.getList(this.pageSize, offset).subscribe(result => {
      this.pokemons.update(current => [...current, ...result.pokemons]);
      this.total.set(result.count);
      this.isLoading.set(false);
    });
  }

  get hasMore(): boolean {
    return this.total() === 0 || this.pokemons().length < this.total();
  }

  onSearch(event: Event) {
    this.recherche.set((event.target as HTMLInputElement).value);
  }
}