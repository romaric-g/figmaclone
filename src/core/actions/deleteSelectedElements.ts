import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { Action } from "./action";

export class DeleteSelectedElements extends Action {

    private selection: Selection;

    constructor(selection: Selection) {
        super("Delete selected elements")
        this.selection = selection
    }

    apply(editor: Editor) {
        const componentsToRemove = this.selection.getComponents()
        editor.selectionManager.setSelection(new Selection([]))

        for (const element of componentsToRemove) {
            editor.treeManager.unregisterComponent(element)
        }

        treeElementSubject.next(editor.treeManager.toData())
    }

}