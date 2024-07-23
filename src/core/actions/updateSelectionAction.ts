import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { Action } from "./action";




export class UpdateSelectionAction extends Action {

    private selection: Selection;

    constructor(newSelection: Selection) {
        super("Update selection")
        this.selection = newSelection
    }

    apply(editor: Editor) {
        editor.selectionManager.setSelection(this.selection)

        selectionChangeSubject.next(this.selection.toData())
        treeElementSubject.next(editor.treeManager.toData())
    }


}