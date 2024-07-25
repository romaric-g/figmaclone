import { Editor } from "../../editor";
import { Selection } from "../../selections/selection";
import { MenuItem } from "../menuItem";


export class CopyItem extends MenuItem {

    private selection: Selection;

    constructor(selection: Selection) {
        super("Copier", "Ctrl+C")
        this.selection = selection;
    }

    apply(): void {
        console.log("COPY")

        if (!this.selection.isEmpty()) {
            Editor.getEditor().selectionManager.copySelection()
        }
    }
}