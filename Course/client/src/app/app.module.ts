import { RatingComponent } from './rating/rating.component';
import { TableauScoreService } from './tableauScore/tableauScoreService.service';
import { FinDePartieComponent } from './finDepartie/finDePartie.component';
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
import { InscriptionComponent } from './accueil/admin/inscription/inscription.component';
import { ConnexionComponent } from './accueil/admin/connexion/connexion.component';
import { MotDepasseOublieComponent } from './accueil/admin/motDepasseOublie/motDepasseOublie.component';
import { ModificationMotDePasseComponent } from './accueil/admin/modificationMotDepasse/modificationMotDePasse.component';
import { ConfigurationPartieComponent } from './configurationPartie/configurationPartie.component';


import { RenderService } from './renderService/render.service';
import { LumiereService } from './dayNight/dayNight.service';
import { PisteService } from './piste/piste.service';
import { FacadeCoordonneesService } from './facadeCoordonnees/facadecoordonnees.service';
import { FacadeSourisService } from './facadeSouris/facadesouris.service';
import { FacadePointService } from './facadePoint/facadepoint.service';
import { FacadeLigneService } from './facadeLigne/facadeligne.service';
import { MessageErreurService } from './messageErreurs/messageerreur.service';
import { GenerateurPisteService } from './generateurPiste/generateurpiste.service';
import { UtilisateurService } from './accueil/utilisateur.service';
import { MusiqueService } from './musique/musique.service';
import { FiltreCouleurService } from './filtreCouleur/filtreCouleur.service';
import { ObjetService } from './objetService/objet.service';
import { CameraService } from './cameraService/cameraService.service';


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
    ConnexionComponent,
    InscriptionComponent,
    MotDepasseOublieComponent,
    ModificationMotDePasseComponent,
    FiltreCouleurComponent,
    ObjetRandomComponent,
    ConfigurationPartieComponent,
    FinDePartieComponent,
    RatingComponent
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
    ObjetService,
    LumiereService,
    TableauScoreService,
    CameraService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
