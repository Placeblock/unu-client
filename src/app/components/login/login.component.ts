import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Color } from 'src/app/models/card/color.model';
import { NumberUnUCard } from 'src/app/models/card/number/number-un-ucard.model';
import { Draw2UnUCard } from 'src/app/models/card/special/draw2-un-ucard.model';
import { Draw4UnUCard } from 'src/app/models/card/special/draw4-un-ucard.model';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { WebsocketService } from 'src/app/services/websocket.service';
import { RoomState } from 'src/app/states/room-state.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
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

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService, private fb: FormBuilder, public roomState: RoomState) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      console.log(params);
      if (params["roomid"] !== "") {
        this.loginForm.controls.gameid.setValue(params["roomid"]);
      }
    });
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
        this.joinRoom();
      } else {
        this.loginstate = LoginState.Switch;
      }
    }
  }

  joinRoom() {
    if (this.loginForm.controls.gameid.valid) {
      this.loginstate = LoginState.Loading;
      let value = this.loginForm.value;
      console.log({"id":value.gameid, "player_name":this.loginForm.value.name});
      this.websocketService.sendMessage('joinRoom', {"id":value.gameid, "player_name":this.loginForm.value.name});
    }
  }

  createRoom() {
    this.websocketService.sendMessage('createRoom', {"player_name":this.loginForm.value.name});
    this.loginstate = LoginState.Loading;
  }

  back() {
    this.loginstate = LoginState.Switch;
    this.roomState.invalid = false;
  }
}

enum LoginState {
  Name,
  Switch,
  JoinRoom,
  Loading,
}
