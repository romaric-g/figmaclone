import { Editor } from "../editor";
import { KeyboardAction } from "./keyboardAction";
import { KeyboardController, ValidKey } from "./keyboardController";

export class KeyboardAttach {

    private keyboardActions: KeyboardAction[] = []
    private activate: boolean = false;

    add(...keyboardAction: KeyboardAction[]) {
        this.keyboardActions.push(...keyboardAction)

        return this;
    }

    enable(keyboardController: KeyboardController) {
        if (!this.activate) {
            this.activate = true;
            this.keyboardActions.forEach((a) => a.register(keyboardController))
        }
    }

    disable(keyboardController: KeyboardController) {
        if (this.activate) {
            this.activate = false;
            this.keyboardActions.forEach((a) => a.unregister(keyboardController))
        }
    }

}