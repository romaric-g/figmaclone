import { Editor } from "../editor";
import { KeyboardController, KeyboardListener as KeyboardListener, ValidKey } from "./keyboardController";


export class KeyboardAction {

    private key: ValidKey;
    private listener: KeyboardListener;

    constructor(key: ValidKey, listener: KeyboardListener) {
        this.key = key;
        this.listener = listener;
    }

    register(keyboardController: KeyboardController) {
        keyboardController.addListener(this.key, this.listener)
    }

    unregister(keyboardController: KeyboardController) {
        keyboardController.removeListener(this.key, this.listener)
    }

}