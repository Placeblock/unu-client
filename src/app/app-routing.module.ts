import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { GameGuardGuard } from './guards/game-guard.guard';

const routes: Routes = [
  { path: 'join', component: LoginComponent, pathMatch: 'full'},
  { path: 'join/:roomid', component: LoginComponent},
  { path: ':roomid', component: GameComponent, canActivate: [GameGuardGuard]},
  { path: '**', redirectTo: 'join'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
