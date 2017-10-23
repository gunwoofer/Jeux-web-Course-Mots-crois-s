import { AuthentificationComponent } from './utilisateur/authentification.component';
import { GenerateurPisteComponent } from './generateurPiste/generateurpiste.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';


const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/authentification', pathMatch: 'full' },
    { path: 'authentification', component: AuthentificationComponent },
    { path: 'listePiste', component: ListePisteComponent },
    { path: 'createurPiste', component: CreateurPisteComponent },
    { path: 'generationpiste', component: GenerateurPisteComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(APP_ROUTES) ],
    exports: [ RouterModule ]
  })

export class AppRoutingModule {}
