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
import {TableViewComponent} from "./game_view/table-view.component";
import {CanvasViewComponent} from "./canvas/canvas-view.component";


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    GameViewComponent,
    TableViewComponent,
    CanvasViewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    RenderService,
    BasicService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

RouterModule.forRoot([
  {
    path: 'partie',
    component: AppComponent
  }
])
