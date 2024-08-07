import { KeyboardController, KeyboardKeyListener as KeyboardKeyListener, ValidKey } from "./keyboardController";


export class KeyboardAction {

    private key: ValidKey;
    private listener: KeyboardKeyListener;

    constructor(key: ValidKey, listener: KeyboardKeyListener) {
        this.key = key;
        this.listener = listener;
    }

    register(keyboardController: KeyboardController) {
        keyboardController.addKeyListener(this.key, this.listener)
    }

    unregister(keyboardController: KeyboardController) {
        keyboardController.removeKeyListener(this.key, this.listener)
    }

}