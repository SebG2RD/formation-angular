import { Component } from '@angular/core';

@Component({
  selector: 'app-meteo-carte',
  imports: [],
  templateUrl: './meteo-carte.html',
  styleUrl: './meteo-carte.scss',
})
export class MeteoCarte {
  meteo = {
    nom: 'Paris',
    temperature: 18,
    condition: 'Ensoleillé',
    humidite: 45,
    vent: 12,
  };

  get conditionEmoji(): string {
    switch (this.meteo.condition) {
      case 'Ensoleillé':
        return '☀️';
      case 'Nuageux':
        return '☁️';
      case 'Pluvieux':
        return '🌧️';
      default:
        return '🌤️';
    }
  }
}
