import { treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { Action } from "./action";

export class DeleteSelectedElementsAction extends Action {

    private selection: SelectedComponentsModifier;

    constructor(selection: SelectedComponentsModifier) {
        super("Delete selected elements")
        this.selection = selection
    }

    apply(editor: Editor) {
        const componentsToRemove = this.selection.getComponents()
        editor.selectionManager.setSelection(new SelectedComponentsModifier([]))

        for (const element of componentsToRemove) {
            element.destroy()
        }

        editor.toolManager.resetSelection(editor.selectionManager.getSelection())

        treeElementSubject.next(editor.treeManager.toData())

        editor.history.add(editor.makeSnapshot())
    }

}