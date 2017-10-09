import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';

import { RenderService } from './cube/render.service';
import { BasicService } from './basic.service';
import {AppRoutingModule} from './app-routing.module';
import {GameViewComponent} from './game_view/game-view.component';
import {CanvasViewComponent} from './canvas/canvas-view.component';
import {IndiceViewComponent} from './indice/indice-view.component';
import {InfosJeuViewComponent} from "./infos_jeu/infos-jeu-view.component";
import {IndiceViewService} from "./indice/indice-view.service";


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    GameViewComponent,
    CanvasViewComponent,
    IndiceViewComponent,
    InfosJeuViewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    BasicService,
    IndiceViewService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

RouterModule.forRoot([
  {
    path: 'partie',
    component: AppComponent
  }
]);