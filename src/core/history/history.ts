import { treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Snapshot } from "./snapshot";


export class History {

    private stack: Snapshot[] = []

    add(snapshot: Snapshot) {
        if (this.stack.length >= 50) {
            this.stack.shift();
        }
        this.stack.push(snapshot)

        console.log("ADD HISTORY", this.stack.length)

    }

    restoreLastSnapshot() {
        if (this.stack.length <= 1) {
            return undefined;
        }

        this.stack.pop()

        const snapshot = this.stack[this.stack.length - 1];

        const editor = Editor.getEditor()
        editor.restore(snapshot)
    }


}