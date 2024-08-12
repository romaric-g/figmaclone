import { Editor } from "../../editor";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { MenuItem } from "../menuItem";


export class CopyItem extends MenuItem {

    private selection: SelectedComponentsModifier;

    constructor(selection: SelectedComponentsModifier) {
        super("Copier", "Ctrl+C")
        this.selection = selection;
    }

    apply(): void {
        if (!this.selection.isEmpty()) {
            Editor.getEditor().selectionManager.copySelection()
        }
    }
}