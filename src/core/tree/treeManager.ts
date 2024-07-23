import { Container } from "pixi.js";
import { TreeRect } from "./treeRect";
import { Editor } from "../editor";
import { TreeData, treeElementSubject } from "../../ui/subjects";
import { TreeRoot } from "./treeRoot";
import { TreeComponent } from "./treeComponent";
import { TreeContainer } from "./treeContainer";

export class TreeManager {

    private _editor: Editor;
    private _treeRoot: TreeRoot;
    private _lastNameIndex: number = 0;

    constructor(editor: Editor) {
        this._editor = editor;
        this._treeRoot = new TreeRoot("root")
    }

    init() {
        treeElementSubject.next(this.toData())
    }

    getTree() {
        return this._treeRoot;
    }

    registerComponent(component: TreeComponent) {
        component.init()
        if (component instanceof TreeContainer) {
            for (const childComponent of component.getComponents()) {
                this.registerComponent(childComponent)
            }
        }
    }

    unregisterComponent(component: TreeComponent) {
        const parent = component.getParentContainer()
        if (parent) {
            if (component instanceof TreeContainer) {
                const allChildren = [...component.getComponents()]

                for (const children of allChildren) {
                    this.unregisterComponent(children)
                }
            }
            parent.remove(component)
        }
        component.destroy()
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

}


