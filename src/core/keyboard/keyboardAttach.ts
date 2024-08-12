import { KeyboardAction } from "./keyboardAction";
import { KeyboardController, KeyboardEventListener, ValidKey } from "./keyboardController";

export class KeyboardAttach {

    private keyboardActions: KeyboardAction[] = []
    private activate: boolean = false;
    private keyboardEventsListener: KeyboardEventListener[] = []


    addActions(...keyboardAction: KeyboardAction[]) {
        this.keyboardActions.push(...keyboardAction)
        return this;
    }

    addListener(...keyboardEvents: KeyboardEventListener[]) {
        this.keyboardEventsListener.push(...keyboardEvents)
        return this;
    }

    enable(keyboardController: KeyboardController) {
        if (!this.activate) {
            this.activate = true;
            this.keyboardActions.forEach((a) => a.register(keyboardController))
            this.keyboardEventsListener.forEach((kel) => keyboardController.addEventListener(kel))
        }
    }

    disable(keyboardController: KeyboardController) {
        if (this.activate) {
            this.activate = false;
            this.keyboardActions.forEach((a) => a.unregister(keyboardController))
            this.keyboardEventsListener.forEach((kel) => keyboardController.removeEventListener(kel))
        }
    }

}