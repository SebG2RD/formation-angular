import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DigimonGraphqlService } from '../../services/digimon-graphql.service';
import { FavorisService } from '../../services/favoris.service';
import { DigimonPage } from '../../models/digimon.model';

@Component({
  selector: 'app-digimon-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './digimon-list.html',
  styleUrl: './digimon-list.scss',
})
export class DigimonList implements OnInit {
  private service = inject(DigimonGraphqlService);
  protected favoris = inject(FavorisService); // partagé, utilisé dans le template

  page = signal<DigimonPage | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  recherche = signal('');
  pageCourante = signal(0);

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    const nom = this.recherche().trim() || undefined;
    this.service.getDigimons(this.pageCourante(), 20, nom).subscribe({
      next: (data) => {
        this.page.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Le serveur GraphQL (:4000) est-il lancé ?');
        this.loading.set(false);
      },
    });
  }

  rechercher() {
    this.pageCourante.set(0);
    this.charger();
  }

  pagePrecedente() {
    if (this.pageCourante() > 0) {
      this.pageCourante.update((p) => p - 1);
      this.charger();
    }
  }

  pageSuivante() {
    this.pageCourante.update((p) => p + 1);
    this.charger();
  }
}
