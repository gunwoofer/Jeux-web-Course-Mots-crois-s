import { GenerateurPisteService } from './generateurPiste/generateurpiste.service';
import { GenerateurPisteComponent } from './generateurPiste/generateurpiste.component';
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


import { RenderService } from './renderService/render.service';
import { PisteService } from './piste/piste.service';
import { FacadeCoordonneesService } from './facadeCoordonnees/facadecoordonnees.service';
import { FacadeSourisService } from './facadeSouris/facadesouris.service';
import { FacadePointService } from './facadePoint/facadepoint.service';
import { FacadeLigneService } from './facadeLigne/facadeligne.service';
import { MessageErreurService } from './messageErreurs/messageerreur.service';
import { TableauScoreService } from './tableauScore/tableauScoreService.service';


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
    GenerateurPisteComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    TableauScoreService,
    PisteService,
    FacadeCoordonneesService,
    FacadeSourisService,
    FacadePointService,
    FacadeLigneService,
    MessageErreurService,
    GenerateurPisteService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
