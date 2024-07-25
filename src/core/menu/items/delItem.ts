import { DeleteSelectedElementsAction } from "../../actions/deleteSelectedElementsAction";
import { Editor } from "../../editor";
import { Selection } from "../../selections/selection";
import { MenuItem } from "../menuItem";


export class DelItem extends MenuItem {

    private selection: Selection;

    constructor(selection: Selection) {
        super("Supprimer", "Del")
        this.selection = selection;
    }

    apply(): void {
        if (!this.selection.isEmpty()) {
            Editor.getEditor().actionManager.push(
                new DeleteSelectedElementsAction(this.selection)
            )
        }
    }
}