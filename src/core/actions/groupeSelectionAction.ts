import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { Action } from "./action";

export class GroupeSelectionAction extends Action {

    private selection: Selection;

    constructor(selection: Selection) {
        super("Groupe selection")
        this.selection = selection
    }

    apply(editor: Editor) {
        editor.selectionManager.getRootContainer().groupeSelection(this.selection)

        const selection = editor.selectionManager.getSelection()

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

    }
}