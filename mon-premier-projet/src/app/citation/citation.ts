import { Component } from '@angular/core';

@Component({
  selector: 'app-citation',
  imports: [],
  templateUrl: './citation.html',
  styleUrl: './citation.scss',
})
export class Citation {
  citations = [
    "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.",
    "La seule limite à notre épanouissement de demain sera nos doutes d'aujourd'hui.",
    "N'attends pas le moment parfait, saisis le moment et rends-le parfait.",
    "Les grandes choses ne sont jamais faites par une seule personne. Elles sont faites par une équipe.",
    "Osez être différent pour inspirer ceux qui vous entourent."
  ];

  citation = this.getRandomCitation();

  getRandomCitation(): string {
    const index = Math.floor(Math.random() * this.citations.length);
    return this.citations[index];
  }

  showRandomCitation(): void {
    let newCitation = this.getRandomCitation();
    while (newCitation === this.citation && this.citations.length > 1) {
      newCitation = this.getRandomCitation();
    }
    this.citation = newCitation;
  }
}

