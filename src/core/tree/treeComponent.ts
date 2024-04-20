import { Editor } from "../editor";
import { TreeContainer } from "./treeContainer"


export class TreeComponent {

    private currentContainerParent?: TreeContainer;

    setParentContainer(treeContainer: TreeContainer) {
        this.currentContainerParent = treeContainer
    }

    deleteParentContainer() {
        this.currentContainerParent = undefined;
    }

    getContainerParent() {
        return this.currentContainerParent;
    }

    render(zIndex: number): number {
        return zIndex
    }

    init(editor: Editor) {

    }

    destroy() {

    }

}