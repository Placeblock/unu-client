import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoomState } from '../states/room-state.service';

@Injectable({
  providedIn: 'root'
})
export class GameGuardGuard implements CanActivate {
  constructor(private roomState: RoomState, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const gameid = route.paramMap.get("roomid");
    console.log(gameid);
    console.log(this.roomState.me);
    console.log(this.roomState.id);
    if(gameid != null && this.roomState.me == null && this.roomState.id == "") {
      console.log("REDIRECT");
      this.router.navigate(["join", gameid]);
      return false;
    }
    return true;
  }
  
}
