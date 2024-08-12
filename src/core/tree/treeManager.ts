import { TreeData, treeElementSubject } from "../../ui/subjects";
import { TreeComponent } from "./treeComponent";
import { TreeRect } from "./treeRect";
import { TreeContainer } from "./treeContainer";
import { TreeBox } from "./treeBox";

export class TreeManager {

    private _treeRoot: TreeContainer;
    private _lastNameIndex: number = 0;

    constructor() {
        this._treeRoot = new TreeContainer({
            name: "root"
        })
    }

    init() {
        treeElementSubject.next(this.toData())
    }

    getTree() {
        return this._treeRoot;
    }

    getAllBoxComponents() {
        return this._treeRoot.getDepthComponents().filter(r => r instanceof TreeBox)
    }

    getContainerByRootIndex(index: number) {
        return this.getContainerByIndex([index])
    }

    getContainerByIndex(depthIndex: number[]) {
        return this._treeRoot.getChildComponent(depthIndex)
    }

    toData() {
        const treeData: TreeData = {
            tree: this._treeRoot.toData(0).children
        }

        return treeData;
    }

    getNextName() {
        this._lastNameIndex++;
        return this._lastNameIndex.toString()
    }

    restoreTree(treeComponents: TreeComponent[]) {
        for (const child of [...this._treeRoot.getComponents()]) {
            child.destroy()
        }

        this._treeRoot = new TreeContainer({
            name: "root"
        })

        for (const component of treeComponents) {
            this._treeRoot.getAnchor().add(component.getAnchor())
        }

    }

}


