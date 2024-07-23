import { UpdateSelectionAction } from "../actions/updateSelectionAction";
import { Editor } from "../editor";
import { Selection } from "../selections/selection";
import { TreeComponent } from "./treeComponent";
import { TreeContainer } from "./treeContainer";


export class TreeRoot extends TreeContainer {

    moveFromIndexs(fromIndexs: number[], toIndexs: number[]) {
        const component = this.getComponent(fromIndexs)
        const toContainer = this.getContainer(toIndexs.slice(0, -1))

        if (component === undefined || toContainer === undefined) {
            return false
        }

        const fromContainer = component.getParentContainer()

        if (fromContainer) {
            let fromIdx = fromIndexs.slice(-1)[0]
            let toIdx = toIndexs.slice(-1)[0]

            if (toContainer == fromContainer) {
                if (fromIdx < toIdx) {
                    toIdx--
                }
            }

            fromContainer.remove(component)
            toContainer.addAtIndex(component, toIdx)

            if (fromContainer.isEmpty()) {
                const parent = fromContainer.getParentContainer()
                if (parent) {
                    parent.remove(fromContainer)
                }
            }
        }
    }

    groupeSelection(selection: Selection) {

        const editor = Editor.getEditor()
        const treeManager = editor.treeManager
        const newGroupeComponent = new TreeContainer(`groupe ${treeManager.getNextName()}`)

        if (selection.isEmpty()) {
            return
        }

        const targetParent = selection.getFirstIndexComponent().getParentContainer()

        if (!targetParent) {
            return
        }

        editor.selectionManager.unselectAll()

        for (const component of selection.getComponents()) {
            component.getParentContainer()?.remove(component)
            newGroupeComponent.add(component)
        }

        treeManager.registerComponent(newGroupeComponent)
        targetParent.add(newGroupeComponent)

        editor.selectionManager.setSelection(new Selection([newGroupeComponent]))
    }
}