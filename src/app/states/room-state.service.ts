import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Player } from "../models/player";
import { getDefaultRoundSettings, RoundSettings } from "../models/roundsettings";

@Injectable({
    providedIn: 'root'
})
export class RoomState {
    private _players = new BehaviorSubject<Player[]>([]);
    players$ = this._players.asObservable();
    private _me = new BehaviorSubject<Player | null>(null);
    me$ = this._me.asObservable();
    private _owner = new BehaviorSubject<Player | null>(null);
    owner$ = this._owner.asObservable();
    private _name = new BehaviorSubject<string>("");
    name$ = this._name.asObservable();
    private _isShowingSettings = new BehaviorSubject<boolean>(false);
    isShowingSettings$ = this._isShowingSettings.asObservable();
    private _settings = new BehaviorSubject<RoundSettings>(getDefaultRoundSettings());
    settings$ = this._settings.asObservable();
    private _isRoundRunning = new BehaviorSubject<boolean>(false);
    isRoundRunning$ = this._isRoundRunning.asObservable();

    reset() {
        this.me = null;
        this.owner = null;
        this.players = [];
        this.name = "";
        this.isShowingSettings = false;
        this.settings = getDefaultRoundSettings();
    }

    get players(): Player[] {
        return this._players.getValue();
    }

    set players(players: Player[]) {
        this._players.next(players);   
    }

    get owner(): Player | null {
        return this._owner.getValue();
    }

    set owner(player: Player | null) {
        this._owner.next(player);
    }

    get me(): Player | null {
        return this._me.getValue();
    }

    set me(player: Player | null) {
        this._me.next(player);
    }

    addPlayer(player: Player) {
        this.players = [...this.players, player];
    }

    removePlayer(player: Player) {
        this.players = this.players.filter(value => value.uuid != player.uuid);
    }

    get name(): string {
        return this._name.getValue();
    }

    set name(name: string) {
        this._name.next(name);
    }

    get settings(): RoundSettings {
        console.log(this._settings);
        return this._settings.getValue();
    }

    set settings(settings: RoundSettings) {
        this._settings.next(settings);
    }

    get isShowingSettings(): boolean {
        return this._isShowingSettings.getValue();
    }

    set isShowingSettings(showing: boolean) {
        this._isShowingSettings.next(showing);
    }

    get isRoundRunning(): boolean {
        return this._isRoundRunning.getValue();
    }

    set roundRunning(running: boolean) {
        this._isRoundRunning.next(running);
    }
}
