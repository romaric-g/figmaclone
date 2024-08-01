import { GroupeSelectionAction } from "../../actions/groupeSelectionAction";
import { Editor } from "../../editor";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { MenuItem } from "../menuItem";


export class GroupeItem extends MenuItem {

    private selection: SelectedComponentsModifier;

    constructor(selection: SelectedComponentsModifier) {
        super("Grouper", "Ctrl+G")
        this.selection = selection;
    }

    apply(): void {
        if (!this.selection.isEmpty()) {
            Editor.getEditor().actionManager.push(
                new GroupeSelectionAction(this.selection)
            )
        }
    }
}