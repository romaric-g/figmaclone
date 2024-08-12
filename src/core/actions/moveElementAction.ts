import { treeElementSubject } from "../../ui/subjects";
import { TreeContainer } from "../tree/treeContainer";
import { Action } from "./action";
import { Editor } from "../editor";

export class MoveElementAction extends Action {

    private from: number[];
    private to: number[]

    constructor(from: number[], to: number[]) {
        super("Move element")
        this.from = from
        this.to = to
    }

    apply(editor: Editor) {
        const tree = editor.treeManager.getTree()

        this.moveFromIndexs(tree, this.from, this.to)

        treeElementSubject.next(editor.treeManager.toData())

        editor.history.add(editor.makeSnapshot())

    }


    moveFromIndexs(treeRoot: TreeContainer, fromIndexs: number[], toIndexs: number[]) {
        const component = treeRoot.getChildComponent(fromIndexs)
        const toComponent = treeRoot.getChildComponent(toIndexs.slice(0, -1))

        if (component === undefined || toComponent === undefined || !(toComponent instanceof TreeContainer)) {
            return false;
        }

        const fromContainer = component.getAnchor().getAnchorContainer()?.component

        if (fromContainer && fromContainer instanceof TreeContainer) {
            let fromIdx = fromIndexs.slice(-1)[0]
            let toIdx = toIndexs.slice(-1)[0]

            if (toComponent == fromContainer) {
                if (fromIdx < toIdx) {
                    toIdx--
                }
            }

            fromContainer.getAnchor().remove(component.getAnchor())
            toComponent.getAnchor().add(component.getAnchor(), toIdx)

            if (fromContainer.isEmpty()) {
                const parent = fromContainer.getAnchor().getAnchorContainer()
                if (parent) {
                    parent.remove(fromContainer.getAnchor())
                }
            }
        }
    }
}