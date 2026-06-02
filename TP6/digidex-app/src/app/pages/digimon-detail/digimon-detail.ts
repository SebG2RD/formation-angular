import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DigimonGraphqlService } from '../../services/digimon-graphql.service';
import { Digimon } from '../../models/digimon.model';

@Component({
  selector: 'app-digimon-detail',
  imports: [RouterLink],
  templateUrl: './digimon-detail.html',
  styleUrl: './digimon-detail.scss',
})
export class DigimonDetail implements OnInit {
  private service = inject(DigimonGraphqlService);

  // L'id vient du paramètre d'URL (config withComponentInputBinding, voir routes)
  id = input.required<string>();

  digimon = signal<Digimon | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.service.getDigimon(Number(this.id())).subscribe({
      next: (d) => {
        this.digimon.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
