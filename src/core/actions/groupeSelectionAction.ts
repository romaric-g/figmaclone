import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { TreeContainer } from "../tree/treeContainer";
import { Action } from "./action";

export class GroupeSelectionAction extends Action {

    private selection: SelectedComponentsModifier;

    constructor(selection: SelectedComponentsModifier) {
        super("Groupe selection")
        this.selection = selection
    }

    apply(editor: Editor) {


        if (this.selection.isEmpty()) {
            return
        }

        const newGroupeComponent = new TreeContainer({
            name: `groupe ${editor.treeManager.getNextName()}`
        })

        const targetParent = this.selection.getFirstIndexComponent().getAnchor().getAnchorContainer()

        if (!targetParent) {
            return
        }

        editor.selectionManager.unselectAll()

        for (const component of this.selection.getComponents()) {
            component.getAnchor().getAnchorContainer()?.remove(component.getAnchor())
            newGroupeComponent.getAnchor().add(component.getAnchor())
        }

        targetParent.add(newGroupeComponent.getAnchor())

        editor.selectionManager.setSelectionModifier(new SelectedComponentsModifier([newGroupeComponent]))

        const selection = editor.selectionManager.getSelectionModifier()

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

        editor.history.add(editor.makeSnapshot())
    }
}