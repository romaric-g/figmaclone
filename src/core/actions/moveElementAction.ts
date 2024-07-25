import { treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Action } from "./action";


export class MoveElementAction extends Action {

    private from: number[];
    private to: number[]

    constructor(from: number[], to: number[]) {
        super("Move element")
        this.from = from
        this.to = to
    }

    apply(editor: Editor) {
        const tree = editor.treeManager.getTree()

        tree.moveFromIndexs(this.from, this.to)

        treeElementSubject.next(editor.treeManager.toData())

        editor.history.add(editor.makeSnapshot())

    }
}