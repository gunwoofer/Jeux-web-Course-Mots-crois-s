import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { GameViewComponent } from './game_view/app.game-view.component';
import { CanvasViewComponent } from './canvas/app.canvas-view.component';
import { IndiceViewComponent } from './indice/app.indice-view.component';
import { InfosJeuViewComponent } from './infos_jeu/app.infos-jeu-view.component';
import { GameViewService } from './game_view/game-view.service';
import { ChoixPartieViewComponent } from './choix_partie/app.choix-partie-view.component';
import { FinPartieComponent } from './fin_partie/fin-partie.component';
import { FormsModule } from '@angular/forms';
import { TrouverPartieComponent } from './trouver_partie/app.trouver-partie.component';
import { AttentePartieComponent } from './attente_partie/app.attente-partie.component';
import { ChoixPartieService } from './choix_partie/choix-partie.service';
import { TimerService } from './game_view/timer.service';
import { IndiceService } from './game_view/indice.service';
import { ConnexionTempsReelClientService } from './connexion_temps_reel/connexionTempsReelClientService';
import { DessinCanvasService } from './canvas/dessinCanvasService';

@NgModule({
    declarations: [
        AppComponent,
        GameViewComponent,
        CanvasViewComponent,
        IndiceViewComponent,
        InfosJeuViewComponent,
        ChoixPartieViewComponent,
        FinPartieComponent,
        TrouverPartieComponent,
        AttentePartieComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        GameViewService,
        ChoixPartieService,
        ConnexionTempsReelClientService,
        TimerService,
        IndiceService,
        DessinCanvasService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

RouterModule.forRoot([
    {
        path: 'partie',
        component: AppComponent
    }
]);
