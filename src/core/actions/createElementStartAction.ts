import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { TreeBox } from "../tree/treeBox";
import { Action } from "./action";



export class CreateRectStartAction extends Action {

    private treeBox: TreeBox;

    constructor(treeBox: TreeBox) {
        super("Create rect start")
        this.treeBox = treeBox;
    }

    apply(editor: Editor) {

        const selection = new SelectedComponentsModifier([this.treeBox])

        editor.treeManager.getTree().getAnchor().add(this.treeBox.getAnchor())
        editor.selectionManager.setSelectionModifier(selection)

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

    }
}