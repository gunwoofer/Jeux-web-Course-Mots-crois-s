import { GenerateurPisteComponent } from './generateurPiste/generateurpiste.component';
import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    { path: '', redirectTo: 'listePiste', pathMatch: 'full' },
    { path: 'listePiste', component: ListePisteComponent },
    { path: 'createurPiste', component: CreateurPisteComponent },
    { path: 'generationpiste', component: GenerateurPisteComponent }
];

export const JOUEUR_ROUTES: Routes = [
    { path: '', redirectTo: 'listePiste', pathMatch: 'full' },
    { path: 'listePiste', component: ListePisteComponent },
    { path: 'generationpiste', component: GenerateurPisteComponent }
];


