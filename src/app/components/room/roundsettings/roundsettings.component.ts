import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { WebsocketService } from 'src/app/services/websocket.service';
import { RoomState } from 'src/app/states/room-state.service';

@Component({
  selector: 'app-roundsettings',
  templateUrl: './roundsettings.component.html',
  styleUrls: ['./roundsettings.component.scss']
})
export class RoundSettingsComponent {
  fouronfour = new UntypedFormControl(this.roomState.settings.allowdraw4ondraw4);
  twoonfour = new UntypedFormControl(this.roomState.settings.allowdraw2ondraw4);
  fourontwo = new UntypedFormControl(this.roomState.settings.allowdraw4ondraw2);
  wishonfour = new UntypedFormControl(this.roomState.settings.allowwishondraw4);
  fouronwish = new UntypedFormControl(this.roomState.settings.allowdraw4onwish);
  wishonwish = new UntypedFormControl(this.roomState.settings.allowwishonwish);
  startcards = new UntypedFormControl(this.roomState.settings.startcardamount);

  constructor(private webSocketService: WebsocketService, private roomState: RoomState) {}

  update() {
    this.webSocketService.sendMessage("roundSettings", {"settings":{
      "startcardamount":this.startcards.value,
      "allowwishonwish":this.wishonwish.value,
      "allowwishondraw4":this.wishonfour.value,
      "allowdraw4onwish":this.fouronwish.value,
      "allowdraw4ondraw4":this.fouronfour.value,
      "allowdraw4ondraw2":this.fourontwo.value,
      "allowdraw2ondraw4":this.twoonfour.value
    }});
  }
}
