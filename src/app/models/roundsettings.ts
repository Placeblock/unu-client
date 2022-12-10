export interface RoundSettings {
    startcardamount: number;
    allowdraw2ondraw4: boolean;
    allowdraw4ondraw2: boolean;
    allowdraw4ondraw4: boolean;
    allowwishondraw4: boolean;
    allowdraw4onwish: boolean;
    allowwishonwish: boolean;
}

export function getDefaultRoundSettings(): RoundSettings {
    return {
        "allowdraw2ondraw4":true,
        "allowdraw4ondraw2":false,
        "allowdraw4ondraw4":true,
        "allowdraw4onwish":true,
        "allowwishondraw4":true,
        "allowwishonwish":true,
        "startcardamount":7
    }
}
