import { Editor } from "../editor";
import { KeyboardAttach } from "./keyboardAttach";
import { KeyboardController } from "./keyboardController";

export class KeyboardManager {

    private _keyboardAttach: KeyboardAttach;
    public keyboardController = new KeyboardController()

    constructor() {
        this._keyboardAttach = new KeyboardAttach()
    }

    setAttach(keyboardAttach: KeyboardAttach) {
        this._keyboardAttach.disable(this.keyboardController)
        this._keyboardAttach = keyboardAttach;
        this._keyboardAttach.enable(this.keyboardController)
    }

    getAttach() {
        return this._keyboardAttach;
    }

}