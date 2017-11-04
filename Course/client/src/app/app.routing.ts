import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';
import { ConnexionComponent } from './accueil/admin/connexion/connexion.component';
import { InscriptionComponent } from './accueil/admin/inscription/inscription.component';
import { JoueurComponent } from './accueil/joueur/joueur.component';
import { AccueilComponent } from './accueil/accueil.component';
import { GenerateurPisteComponent } from './generateurPiste/generateurpiste.component';
import { MotDepasseOublieComponent } from './accueil/admin/motDepasseOublie/motDepasseOublie.component';
import { ObjetRandomComponent } from './ObjectRandom/objetRandom.component';
import { FiltreCouleurComponent } from './filtreCouleur/filtreCouleur.component';
import { ModificationMotDePasseComponent } from './accueil/admin/modificationMotDepasse/modificationMotDePasse.component';
import { FinDePartieComponent } from './finDepartie/finDePartie.component';


const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/finPartie', pathMatch: 'full' },
    { path: 'filtre', component: FiltreCouleurComponent },
    { path: 'objetRandom', component: ObjetRandomComponent },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'motDePasseOublie', component: MotDepasseOublieComponent },
    { path: 'admin', component: ConnexionComponent },
    { path: 'joueur', component: JoueurComponent },
    { path: 'accueil', component: AccueilComponent },
    { path: 'ModifierPass', component: ModificationMotDePasseComponent },
    { path: 'listePiste', component: ListePisteComponent },
    { path: 'createurPiste', component: CreateurPisteComponent },
    { path: 'generationpiste', component: GenerateurPisteComponent },
    { path: 'finPartie', component: FinDePartieComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(APP_ROUTES) ],
    exports: [ RouterModule ]
  })

export class AppRoutingModule {}
