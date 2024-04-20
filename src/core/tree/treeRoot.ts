import { Editor } from "../editor";
import { TreeContainer } from "./treeContainer";


export class TreeRoot extends TreeContainer {

    move(fromIndexs: number[], toIndexs: number[]) {
        const fromComponent = this.getComponent(fromIndexs)
        const toContainer = this.getContainer(toIndexs.slice(0, -1))

        console.log("FROM", fromIndexs, fromComponent)
        console.log("TO", toIndexs, toContainer)

        if (fromComponent === undefined || toContainer === undefined) {
            return false
        }

        const fromContainer = fromComponent.getContainerParent()

        if (fromContainer) {
            console.log("MOVE APPLY")
            fromContainer.remove(fromComponent)
            toContainer.add(fromComponent, toIndexs.slice(-1)[0])
        }

        Editor.getEditor().treeManager.emitTreeChangeEvent()
    }
}