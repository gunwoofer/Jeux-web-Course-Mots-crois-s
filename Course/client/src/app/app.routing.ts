import { InscriptionComponent } from './accueil/admin/inscription.component';
import { JoueurComponent } from './accueil/joueur/joueur.component';
import { AdminComponent } from './accueil/admin/admin.component';
import { AccueilComponent } from './accueil/accueil.component';
import { GenerateurPisteComponent } from './generateurPiste/generateurpiste.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';


const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/accueil', pathMatch: 'full' },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'joueur', component: JoueurComponent },
    { path: 'accueil', component: AccueilComponent },
    { path: 'listePiste', component: ListePisteComponent },
    { path: 'createurPiste', component: CreateurPisteComponent },
    { path: 'generationpiste', component: GenerateurPisteComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(APP_ROUTES) ],
    exports: [ RouterModule ]
  })

export class AppRoutingModule {}
