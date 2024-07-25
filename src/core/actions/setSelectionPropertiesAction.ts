import { selectionChangeSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { Action } from "./action";



export class SetSelectionPropertiesAction extends Action {

    private selection: Selection;

    constructor(newSelection: Selection) {
        super("Set selection properties")
        this.selection = newSelection
    }


    apply(editor: Editor): void {

        selectionChangeSubject.next(this.selection.toData())

        editor.history.add(editor.makeSnapshot())
    }

}