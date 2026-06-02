import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardApiService } from '../../services/card-api.service';
import { FilterService } from '../../services/filter.service';
import { CollectionService } from '../../services/collection.service';
import { Card } from '../../models';

@Component({
  selector: 'app-card-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './card-list.html',
})
export class CardListComponent implements OnInit {
  private api = inject(CardApiService);
  protected filters = inject(FilterService); // état filtres (template)
  protected collection = inject(CollectionService); // état deck (template)

  cards = signal<Card[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  recherche = '';

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    this.api.getCards(this.filters.filters(), 24, 0).subscribe({
      next: (res) => {
        this.cards.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur de chargement des cartes.');
        this.loading.set(false);
      },
    });
  }

  rechercher() {
    this.filters.setRecherche(this.recherche);
    this.charger();
  }

  filtrerType(type: string) {
    this.filters.setType(type);
    this.charger();
  }
  filtrerAttribut(attr: string) {
    this.filters.setAttribute(attr);
    this.charger();
  }
  reinitialiser() {
    this.filters.reset();
    this.recherche = '';
    this.charger();
  }
}
