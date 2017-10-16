import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {CubeComponent} from './cube/cube.component';
import {GameViewComponent} from './game_view/game-view.component';


const routes: Routes = [
  { path: 'view', component: GameViewComponent},
  { path: 'partie', component: AppComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
