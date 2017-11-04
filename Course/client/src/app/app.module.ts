import { ConfigurationPartieComponent } from './configurationPartie/configurationPartie.component';
import { LumiereService } from './dayNight/dayNight';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { PisteValidationComponent } from './pisteValidator/pisteValidation.component';
import { PisteComponent } from './piste/piste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';
import { TableauScoreComponent } from './tableauScore/tableauScore.component';
import { CourseComponent } from './course/course.component';
import { AccueilComponent } from './accueil/accueil.component';
import { GenerateurPisteComponent } from './generateurPiste/generateurpiste.component';
import { JoueurComponent } from './accueil/joueur/joueur.component';
import { InscriptionComponent } from './accueil/admin/inscription/inscription.component';
import { ConnexionComponent } from './accueil/admin/connexion/connexion.component';
import { MotDepasseOublieComponent } from './accueil/admin/motDepasseOublie/motDepasseOublie.component';
import { ModificationMotDePasseComponent } from './accueil/admin/modificationMotDepasse/modificationMotDePasse.component';
import { FiltreCouleurComponent } from './filtreCouleur/filtreCouleur.component';
import { ObjetRandomComponent } from './ObjectRandom/objetRandom.component';


import { RenderService } from './renderService/render.service';
import { PisteService } from './piste/piste.service';
import { FacadeCoordonneesService } from './facadeCoordonnees/facadecoordonnees.service';
import { FacadeSourisService } from './facadeSouris/facadesouris.service';
import { FacadePointService } from './facadePoint/facadepoint.service';
import { FacadeLigneService } from './facadeLigne/facadeligne.service';
import { MessageErreurService } from './messageErreurs/messageerreur.service';
import { GenerateurPisteService } from './generateurPiste/generateurpiste.service';
import { UtilisateurService } from './accueil/utilisateur.service';
import { MusiqueService } from './musique/musique.service';
import { ObjetRandomService } from './ObjectRandom/objetRandom.service';
import { FiltreCouleurService } from './filtreCouleur/filtreCouleur.service';


import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app.routing';



@NgModule({
  declarations: [
    AppComponent,
    CreateurPisteComponent,
    PisteValidationComponent,
    PisteComponent,
    ListePisteComponent,
    CourseComponent,
    TableauScoreComponent,
    GenerateurPisteComponent,
    AccueilComponent,
    JoueurComponent,
    ConnexionComponent,
    InscriptionComponent,
    MotDepasseOublieComponent,
    ModificationMotDePasseComponent,
    FiltreCouleurComponent,
    ObjetRandomComponent,
    ConfigurationPartieComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    PisteService,
    FacadeCoordonneesService,
    FacadeSourisService,
    FacadePointService,
    FacadeLigneService,
    MessageErreurService,
    GenerateurPisteService,
    MusiqueService,
    UtilisateurService,
    FiltreCouleurService,
    ObjetRandomService,
    LumiereService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
