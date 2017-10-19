import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';

import { RenderService } from './cube/render.service';
import { BasicService } from './basic.service';
import {AppRoutingModule} from './app-routing.module';
import {GameViewComponent} from './game_view/app.game-view.component';
import {CanvasViewComponent} from './canvas/app.canvas-view.component';
import {IndiceViewComponent} from './indice/app.indice-view.component';
import {InfosJeuViewComponent} from './infos_jeu/app.infos-jeu-view.component';
import {IndiceViewService} from './indice/indice-view.service';
import {GameViewService} from './game_view/game-view.service';
import {ChoixPartieViewComponent} from './choix_partie/app.choix-partie-view.component';
import {FinPartieComponent} from './fin_partie/fin-partie.component';


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    GameViewComponent,
    CanvasViewComponent,
    IndiceViewComponent,
    InfosJeuViewComponent,
    ChoixPartieViewComponent,
    FinPartieComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    BasicService,
    IndiceViewService,
    GameViewService
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
