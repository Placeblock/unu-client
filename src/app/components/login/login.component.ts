import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Color } from 'src/app/models/card/color.model';
import { NumberUnUCard } from 'src/app/models/card/number/number-un-ucard.model';
import { Draw2UnUCard } from 'src/app/models/card/special/draw2-un-ucard.model';
import { Draw4UnUCard } from 'src/app/models/card/special/draw4-un-ucard.model';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { WebsocketService } from 'src/app/services/websocket.service';
import { RoomState } from 'src/app/states/room-state.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  LoginState = LoginState;
  faHeart = faHeart
  loginForm = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
    gameid: ["", [Validators.required, Validators.maxLength(4), Validators.minLength(4)]]
  });
  unucard1 = new Draw4UnUCard("");
  unucard2 = new Draw2UnUCard("", Color.BLUE);
  unucard3 = new NumberUnUCard("", 3, Color.RED);
  loginstate: LoginState = LoginState.Name;

  constructor(private roomState: RoomState, private websocketService: WebsocketService, private fb: FormBuilder) {
  }

  getRotation(index: number): number {
    const betweencardsangle = 20;
    const absoluteindexangle = (index+0.5)*betweencardsangle;
    return (absoluteindexangle - 50)
  }

  gameidValue(value: string) {
    this.loginForm.controls.gameid.setValue(value);
    console.log(value);
  }

  setName() {
    if (this.loginstate === LoginState.Name && this.loginForm.controls.name.valid) {
      if (this.loginForm.controls.gameid.valid) {
        this.loginstate = LoginState.Loading
      } else {
        this.loginstate = LoginState.Switch
      }
    }
  }

  joinRoom() {
    if (this.loginForm.controls.gameid.valid) {
      this.loginstate = LoginState.Loading;
    }
  }

  createRoom() {
    this.loginstate = LoginState.Loading;
  }
}

enum LoginState {
  Name,
  Switch,
  JoinRoom,
  Loading,
}
