import { PasteCopiedSelectionAction } from "../../actions/pasteCopiedSelectionAction";
import { Editor } from "../../editor";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { MenuItem } from "../menuItem";


export class PasteItem extends MenuItem {


    constructor() {
        super("Coller", "Ctrl+V")
    }

    apply(): void {
        const editor = Editor.getEditor()
        const copiedSelection = editor.selectionManager.getCopiedSelection()

        if (copiedSelection) {
            editor.actionManager.push(
                new PasteCopiedSelectionAction(copiedSelection)
            )
        }
    }
}