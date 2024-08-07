import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Action } from "./action";


export class UndoAction extends Action {

    constructor() {
        super("Undo")
    }

    apply(editor: Editor) {
        editor.history.restoreLastSnapshot()

        selectionChangeSubject.next(editor.selectionManager.getSelectionModifier().toData())
        treeElementSubject.next(editor.treeManager.toData())
    }

}