import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { TreeBox } from "../tree/treeBox";
import { TreeRect } from "../tree/treeRect";
import { Action } from "./action";



export class CreateRectStartAction extends Action {

    private treeBox: TreeBox;

    constructor(treeBox: TreeBox) {
        super("Create rect start")
        this.treeBox = treeBox;
    }

    apply(editor: Editor) {

        const selection = new Selection([this.treeBox])

        this.treeBox.init(true)

        editor.treeManager.getTree().add(this.treeBox)
        editor.selectionManager.setSelection(selection)

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

    }
}