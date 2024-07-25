import { TreeData, treeElementSubject } from "../../ui/subjects";
import { TreeRoot } from "./treeRoot";
import { TreeComponent } from "./treeComponent";


export class TreeManager {

    private _treeRoot: TreeRoot;
    private _lastNameIndex: number = 0;

    constructor() {
        this._treeRoot = new TreeRoot("root")
    }

    init() {
        treeElementSubject.next(this.toData())
    }

    getTree() {
        return this._treeRoot;
    }

    render() {
        this._treeRoot.render(0)
    }

    getContainerByRootIndex(index: number) {
        return this.getContainerByIndex([index])
    }

    getContainerByIndex(depthIndex: number[]) {
        return this._treeRoot.getComponent(depthIndex)
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

        this._treeRoot = new TreeRoot("root")

        for (const component of treeComponents) {
            component.init(false)
            this._treeRoot.add(component)
        }

    }

}


