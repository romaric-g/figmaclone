import { selectionChangeSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { Action } from "./action";


type UpdatePropertiesCallback = (selection: Selection) => void

export class UpdateSelectionPropertiesAction extends Action {

    private selection: Selection;
    private updateProperties: UpdatePropertiesCallback;

    constructor(newSelection: Selection, updateProperties: UpdatePropertiesCallback) {
        super("Update selection properties")
        this.selection = newSelection
        this.updateProperties = updateProperties
    }


    apply(editor: Editor): void {
        this.updateProperties(this.selection)

        selectionChangeSubject.next(this.selection.toData())
    }

}