import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {GameViewComponent} from './game_view/app.game-view.component';
import {ChoixPartieViewComponent} from './choix_partie/choix-partie-view.component';


const routes: Routes = [
  { path: 'view/:nbJoueurs', component: GameViewComponent},
  { path: 'partie', component: AppComponent },
  { path : '**', component: ChoixPartieViewComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
