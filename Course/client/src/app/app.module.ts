import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CreateurPiste } from './createurPiste/createurPiste.component';
import { PisteValidationComponent } from './piste/pisteValidation.component';




import {RenderService} from './createurPiste/render.service';
import {BasicService} from './basic.service';


@NgModule({
  declarations: [
    AppComponent,
    CreateurPiste,
    PisteValidationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    RenderService,
    BasicService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
