import { PasteCopiedSelectionAction } from "../../actions/pasteCopiedSelectionAction";
import { UndoAction } from "../../actions/undoAction";
import { Editor } from "../../editor";
import { Selection } from "../../selections/selection";
import { MenuItem } from "../menuItem";


export class UndoItem extends MenuItem {


    constructor() {
        super("Undo", "Ctrl+Z")
    }

    apply(): void {
        Editor.getEditor().actionManager.push(
            new UndoAction()
        )
    }
}