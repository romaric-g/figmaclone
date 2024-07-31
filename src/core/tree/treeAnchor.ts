import { TreeComponent } from "./treeComponent";
import { TreeContainer } from "./treeContainer";

export class TreeAnchor {

    private treeComponent: TreeComponent;
    private treeContainer?: TreeContainer;

    constructor(treeComponent: TreeComponent) {
        this.treeComponent = treeComponent;
    }

    setContainer(treeContainer: TreeContainer) {
        this.treeContainer = treeContainer;
    }

    removeContainer() {
        this.treeContainer = undefined;
    }



}