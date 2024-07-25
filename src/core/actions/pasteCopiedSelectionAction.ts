import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { SerializedSelection } from "../selections/serialized/serializedSelection";
import { TreeComponent } from "../tree/treeComponent";
import { Action } from "./action";


export class PasteCopiedSelectionAction extends Action {

    private components: TreeComponent[];

    constructor(serializedSelection: SerializedSelection) {
        super("Paste copied selection")
        this.components = serializedSelection.components.map((c) => c.deserialize())
    }

    apply(editor: Editor) {

        for (const component of this.components) {
            component.init(true)
            editor.treeManager.getTree().add(component)
        }

        const selection = new Selection(this.components)

        editor.selectionManager.setSelection(selection)

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

        editor.history.add(editor.makeSnapshot())

    }
}