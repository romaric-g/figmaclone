import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Action } from "./action";

export class ClearSelection extends Action {


    constructor() {
        super("Clear selection")
    }

    apply(editor: Editor) {
        editor.selectionManager.unselectAll()

        selectionChangeSubject.next(editor.selectionManager.getSelectionModifier().toData())
        treeElementSubject.next(editor.treeManager.toData())
    }

}