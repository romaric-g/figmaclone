import { DeleteSelectedElementsAction } from "../../actions/deleteSelectedElementsAction";
import { Editor } from "../../editor";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { MenuItem } from "../menuItem";


export class DelItem extends MenuItem {

    private selection: SelectedComponentsModifier;

    constructor(selection: SelectedComponentsModifier) {
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