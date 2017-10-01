import { CourseComponent } from './course.component';
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


import { RenderService } from './renderService/render.service';
import { BasicService } from './basic.service';
import { PisteService } from './piste/piste.service';

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
    TableauScoreComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    BasicService,
    PisteService,
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
