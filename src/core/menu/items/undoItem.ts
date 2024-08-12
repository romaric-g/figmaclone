import { PasteCopiedSelectionAction } from "../../actions/pasteCopiedSelectionAction";
import { UndoAction } from "../../actions/undoAction";
import { Editor } from "../../editor";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { MenuItem } from "../menuItem";


export class UndoItem extends MenuItem {


    constructor() {
        super("Annuler", "Ctrl+Z")
    }

    apply(): void {
        Editor.getEditor().actionManager.push(
            new UndoAction()
        )
    }
}