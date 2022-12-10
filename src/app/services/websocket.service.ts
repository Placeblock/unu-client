import { forwardRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Color } from '../models/card/color.model';
import { JSONUnUCard } from '../models/card/jsonun-ucard';
import { NumberUnUCard } from '../models/card/number/number-un-ucard.model';
import { Draw2UnUCard } from '../models/card/special/draw2-un-ucard.model';
import { Draw4UnUCard } from '../models/card/special/draw4-un-ucard.model';
import { InvertUnUCard } from '../models/card/special/invert-un-ucard.model';
import { SuspendUnUCard } from '../models/card/special/suspend-un-ucard.model';
import { WishUnUCard } from '../models/card/special/wish-un-ucard.model';
import { UnUCard } from '../models/card/un-ucard.model';
import { Inventory } from '../models/inventory.model';
import { RoomState } from '../states/room-state.service';
import { RoundState } from '../states/round-state.service';
export const WS_ENDPOINT = environment.wsEndpoint;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  subject$: WebSocketSubject<{[key: string]: any}> = webSocket(WS_ENDPOINT);

  constructor(router: Router, private roomState: RoomState, private roundState: RoundState) {
    this.subject$.subscribe((data) => {
      console.log(data);
      switch (data["action"]) {
        case "joinedRoom":
          this.roomState.invalid = false;
          this.roomState.id = data["room"]["id"];
          this.roomState.owner = data["room"]["owner"];
          this.roomState.settings = data["room"]["settings"];
          this.roomState.players = data["room"]["players"];
          this.roomState.me = data["me"];
          this.roomState.isShowingSettings = false;
          if("round" in data["room"]) {
            this.applyRoundData(data["room"]["round"]);
          }
          console.log("NAVIGATE ROUTER" + data["room"]["id"])
          router.navigate([data["room"]["id"]]);
          break;
        case "playerLeftRoom":
          this.roomState.removePlayer(data["player"]);
          this.roundState.removePlayer(data["player"]);
          if (this.roomState.me?.uuid === data["player"]["uuid"]) {
            this.roomState.reset();
            this.roundState.reset();
            router.navigate([""])
          }
          break;
        case "playerJoinedRoom":
          this.roomState.addPlayer(data["player"]);
          break;
        case "newOwner":
          this.roomState.owner = data["player"];
          break;
        case "roundSettings":
          this.roomState.settings = data["settings"];
          break;
        case "inventoryData":
          const newInventory = new Inventory();
          for(const card of data["inventory"]) {
            const unucard = this.getCardFromJson(card);
            if(unucard == null) continue;
            newInventory.addCard(unucard);
          }
          this.roundState.inventorys = new Map;
          this.roundState.players = [];
          this.roundState.setInventory(data["player"], newInventory);
          break;
        case "startRound":
          this.applyRoundData(data["round"]);
          this.roundState.nextTimer = data["timestamp"];
          break;
        case "currentPlayer":
          this.roundState.currentplayer = data["player"];
          this.roundState.nextTimer = data["timestamp"];
          break;
        case "playCard":
          const unuCard2 = this.getCardFromJson(data["unocard"]);
          if(unuCard2 == null) return;
          this.roundState.getInventory(data["player"])?.removeCard(unuCard2);
          this.roundState.currentcard = unuCard2;
          let audio = new Audio();
          audio.src = "../../assets/audio.mp3";
          audio.load();
          audio.play();
          break;
        case "playerDrawHiddenCard":
          this.roundState.getInventory(data["player"])?.addCard(new NumberUnUCard(data["uuid"], 0, Color.RED));
          break;
        case "drawCard":
          if(this.roomState.me == null) return;
          const unoCard3 = this.getCardFromJson(data["unocard"]);
          if(unoCard3 == null) return;
          this.roundState.getInventory(this.roomState.me)?.addCard(unoCard3);
          break;
        case "wishCard":
          this.roundState.showforcecolor = true;
          break;
        case "forcedColor":
          this.roundState.forcedcolor = data["color"];
          if(this.roundState.currentcard instanceof WishUnUCard || this.roundState.currentcard instanceof Draw4UnUCard) {
            this.roundState.currentcard.setChosenColor(Color.fromString(data["color"]));
          }
          break;
        case "drawQueue":
          this.roundState.drawqueue = data["amount"];
          break;
        case "finishRound":
          this.roomState.roundRunning = false;
          break
        case "invalidJoinRoom":
          this.roomState.invalid = true;
          break;
        default:
          break;
      }
    });
  }

  applyRoundData(data: any) {
    const unuCard = this.getCardFromJson(data["currentcard"]);
    if(unuCard != null)  {
      this.roundState.currentcard = unuCard;
    }
    this.roundState.currentplayer = data["currentplayer"];
    this.roundState.drawqueue = 0;
    this.roundState.forcedcolor = null;
    this.roundState.leaderboard = [];
    var meIndex = 0;
    for(var i = 0; i < data["players"].length; i++) {
      if(data["players"][i].uuid == this.roomState.me?.uuid) {
        meIndex = i;
      }
    }
    for(i = 0; i < meIndex; i++) data["players"].push(data["players"].shift());
    for(const jsoninventory of data["inventorys"]) {
      if(jsoninventory["player"].uuid == this.roomState.me?.uuid) continue;
      const inventory = new Inventory();
      for(var i = 0; i < jsoninventory["cards"].length; i++) {
        inventory.addCard(new NumberUnUCard(jsoninventory["cards"][i], 0, Color.RED));
      }
      this.roundState.setInventory(jsoninventory["player"], inventory);
    }
    for(const player of data["players"]) {
      this.roundState.addPlayer(player);
    }
    this.roomState.roundRunning = true;
  }

  getCardFromJson(json: JSONUnUCard): UnUCard | null {
    if(!("type" in json)) return null;
    if(!("uuid" in json)) return null;
    switch (json["type"]) {
        case "number":
            return NumberUnUCard.fromJson(json);
        case "draw4":
            return Draw4UnUCard.fromJson(json);
        case "wish":
            return WishUnUCard.fromJson(json);
        case "draw2":
            return Draw2UnUCard.fromJson(json);
        case "invert":
            return InvertUnUCard.fromJson(json);
        case "suspend":
            return SuspendUnUCard.fromJson(json);
        default:
            return null;
    }
}

  sendMessage(action: string, data: {}) {
    this.subject$.next({"action":action,"data":data});
  }
}
