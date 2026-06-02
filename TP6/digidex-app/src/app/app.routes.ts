import { Routes } from '@angular/router';
import { DigimonList } from './pages/digimon-list/digimon-list';
import { DigimonDetail } from './pages/digimon-detail/digimon-detail';

export const routes: Routes = [
  { path: '', component: DigimonList },
  { path: 'digimon/:id', component: DigimonDetail },
  { path: '**', redirectTo: '' },
];
