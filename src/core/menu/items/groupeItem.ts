import { GroupeSelectionAction } from "../../actions/groupeSelectionAction";
import { Editor } from "../../editor";
import { Selection } from "../../selections/selection";
import { MenuItem } from "../menuItem";


export class GroupeItem extends MenuItem {

    private selection: Selection;

    constructor(selection: Selection) {
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