import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {GameViewComponent} from './game_view/app.game-view.component';
import {ChoixPartieViewComponent} from './choix_partie/app.choix-partie-view.component';
import {FinPartieComponent} from './fin_partie/fin-partie.component';
import {TrouverPartieComponent} from './trouver_partie/app.trouver-partie.component';
import {AttentePartieComponent} from "./attente_partie/app.attente-partie.component";


const routes: Routes = [
  {path: 'view/:nbJoueurs', component: GameViewComponent},
  {path: 'partie/:type/:niveau/:nbJoueurs', component: GameViewComponent},
  {path: 'trouverPartie', component: TrouverPartieComponent},
  {path: 'attentePartie', component: AttentePartieComponent},
  {path: 'partie', component: AppComponent},
  {path: 'partieTerminee', component: FinPartieComponent},
  {path: '**', component: ChoixPartieViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
