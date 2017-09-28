import { RouterModule, Routes } from '@angular/router';

import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';


const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/listePiste', pathMatch: 'full' },
    { path: 'listePiste', component: ListePisteComponent },
    { path: 'createurPiste', component: CreateurPisteComponent }
];

export const routage = RouterModule.forRoot(APP_ROUTES);
