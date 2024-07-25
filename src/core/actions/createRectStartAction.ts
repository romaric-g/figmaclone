import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { TreeRect } from "../tree/treeRect";
import { Action } from "./action";



export class CreateRectStartAction extends Action {

    private treeRect: TreeRect;

    constructor(treeRect: TreeRect) {
        super("Create rect start")
        this.treeRect = treeRect;
    }

    apply(editor: Editor) {

        const selection = new Selection([this.treeRect])

        this.treeRect.init(true)

        editor.treeManager.getTree().add(this.treeRect)
        editor.selectionManager.setSelection(selection)

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

    }
}