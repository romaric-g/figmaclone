import { selectionChangeSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { Action } from "./action";

export class SetSelectionPropertiesAction extends Action {

    private selection: SelectedComponentsModifier;

    constructor(newSelection: SelectedComponentsModifier) {
        super("Set selection properties")
        this.selection = newSelection
    }


    apply(editor: Editor): void {

        selectionChangeSubject.next(this.selection.toData())

        editor.history.add(editor.makeSnapshot())
    }

}