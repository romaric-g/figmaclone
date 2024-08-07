import { treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Snapshot } from "./snapshot";


export class History {

    private maxSize: number;
    private stack: Snapshot[] = []

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    add(snapshot: Snapshot) {
        if (this.stack.length >= this.maxSize) {
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