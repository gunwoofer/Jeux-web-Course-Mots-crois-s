import { GestionPartieService } from './voiture/gestionPartie.service';
import { MondeDuJeuService } from './mondedujeu/mondedujeu.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';
import { APP_BASE_HREF } from '@angular/common';
import { CollisionService } from './voiture/collision.service';


import { RatingComponent } from './rating/rating.component';
import { AppComponent } from './app.component';
import { CreateurPisteComponent } from './createurPiste/createurPiste.component';
import { PisteValidationComponent } from './pisteValidator/pisteValidation.component';
import { PisteComponent } from './piste/piste.component';
import { ListePisteComponent } from './listePiste/listePiste.component';
import { TableauScoreComponent } from './tableauScore/tableauScore.component';
import { AccueilComponent } from './accueil/accueil.component';
import { JeuDeCourseComponent } from './jeuDeCourse/jeudecourse.component';
import { InscriptionComponent } from './accueil/admin/inscription/inscription.component';
import { ConnexionComponent } from './accueil/admin/connexion/connexion.component';
import { MotDepasseOublieComponent } from './accueil/admin/motDepasseOublie/motDepasseOublie.component';
import { ModificationMotDePasseComponent } from './accueil/admin/modificationMotDepasse/modificationMotDePasse.component';
import { FinDePartieComponent } from './finDepartie/finDePartie.component';
import { ConfigurationPartieComponent } from './configurationPartie/configurationPartie.component';
import { AffichageTeteHauteComponent } from './affichageTeteHaute/affichagetetehaute.component';


import { MoteurEditeurPiste } from './moteurEditeurPiste/render.service';
import { TableauScoreService } from './tableauScore/tableauScoreService.service';
import { LumiereService } from './lumiere/lumiere.service';
import { PisteService } from './piste/piste.service';
import { FacadeCoordonneesService } from './facadeCoordonnees/facadecoordonnees.service';
import { EvenementService } from './gestionnaireEvenement/gestionnaireEvenement.service';
import { FacadePointService } from './facadePoint/facadepoint.service';
import { FacadeLigneService } from './facadeLigne/facadeLigne.service';
import { MessageErreurService } from './messageErreurs/messageerreur.service';
import { JeuDeCourseService } from './jeuDeCourse/jeudecourse.service';
import { UtilisateurService } from './accueil/utilisateur.service';
import { MusiqueService } from './musique/musique.service';
import { FiltreCouleurService } from './filtreCouleur/filtreCouleur.service';
import { ObjetService } from './objetService/objet.service';
import { GestionnaireDeVue } from './gestionnaireDeVue/gestionnaireDeVue.service';
import { RatingService } from './rating/rating.service';
import { SkyboxService } from './skybox/skybox.service';
import {EffetSonoreService} from './effetSonore/effetSonore.service';
import { DeplacementService } from './deplacement/deplacement.service';
import { PlacementService } from './objetService/placementVoiture.service';
import { AffichageTeteHauteService } from './affichageTeteHaute/affichagetetehaute.service';
import { SortiePisteService } from './sortiePiste/sortiePiste.service';
import { CreateurPisteService } from './createurPiste/createurPiste.service';



@NgModule({
  declarations: [
    AppComponent,
    CreateurPisteComponent,
    PisteValidationComponent,
    PisteComponent,
    ListePisteComponent,
    TableauScoreComponent,
    JeuDeCourseComponent,
    AccueilComponent,
    ConnexionComponent,
    InscriptionComponent,
    MotDepasseOublieComponent,
    ModificationMotDePasseComponent,
    ConfigurationPartieComponent,
    FinDePartieComponent,
    RatingComponent,
    AffichageTeteHauteComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    MoteurEditeurPiste,
    PisteService,
    FacadeCoordonneesService,
    EvenementService,
    FacadePointService,
    FacadeLigneService,
    MessageErreurService,
    JeuDeCourseService,
    DeplacementService,
    MusiqueService,
    UtilisateurService,
    FiltreCouleurService,
    ObjetService,
    LumiereService,
    TableauScoreService,
    GestionnaireDeVue,
    RatingService,
    SkyboxService,
    PlacementService,
    EffetSonoreService,
    AffichageTeteHauteService,
    CollisionService,
    SortiePisteService,
    CreateurPisteService,
    MondeDuJeuService,
    GestionPartieService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
