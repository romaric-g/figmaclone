import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { Action } from "./action";


export class UpdatingSelectionAction extends Action {

    private selection: SelectedComponentsModifier;

    constructor(newSelection: SelectedComponentsModifier) {
        super("Updating selection")
        this.selection = newSelection
    }

    apply(editor: Editor) {
        editor.selectionManager.setSelectionModifier(this.selection)

        selectionChangeSubject.next(this.selection.toData())
        treeElementSubject.next(editor.treeManager.toData())
    }


}