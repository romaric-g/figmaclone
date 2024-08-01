import { selectionChangeSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { Action } from "./action";


type UpdatePropertiesCallback = (selection: SelectedComponentsModifier) => void

export class UpdateSelectionPropertiesAction extends Action {

    public static lastActions: UpdateSelectionPropertiesAction;

    private selection: SelectedComponentsModifier;
    private updateProperties: UpdatePropertiesCallback;

    constructor(newSelection: SelectedComponentsModifier, updateProperties: UpdatePropertiesCallback) {
        super("Update selection properties")
        this.selection = newSelection
        this.updateProperties = updateProperties
    }


    apply(editor: Editor): void {
        this.updateProperties(this.selection)

        selectionChangeSubject.next(this.selection.toData())
    }

}