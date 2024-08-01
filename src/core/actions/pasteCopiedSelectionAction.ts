import { selectionChangeSubject, treeElementSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { deserializeTreeComponentList } from "../tree/serialized/deserializeComponent";
import { SerialisedTreeComponentList } from "../tree/serialized/serialisedTreeComponentList";
import { TreeComponent } from "../tree/treeComponent";
import { Action } from "./action";


export class PasteCopiedSelectionAction extends Action {

    private components: TreeComponent[];

    constructor(serializedComponents: SerialisedTreeComponentList) {
        super("Paste copied selection")
        this.components = deserializeTreeComponentList(serializedComponents)
    }

    apply(editor: Editor) {

        for (const component of this.components) {
            component.init(true)
            editor.treeManager.getTree().getAnchor().add(component.getAnchor())
        }

        const selection = new SelectedComponentsModifier(this.components)

        editor.selectionManager.setSelection(selection)

        selectionChangeSubject.next(selection.toData())
        treeElementSubject.next(editor.treeManager.toData())

        editor.history.add(editor.makeSnapshot())

    }
}