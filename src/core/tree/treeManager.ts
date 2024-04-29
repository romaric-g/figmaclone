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
        this.emitTreeChangeEvent()
    }

    getTree() {
        return this._treeRoot;
    }

    registerContainer(component: TreeComponent, autoMount = false) {
        component.init()
        if (component instanceof TreeContainer) {
            for (const childComponent of component.getComponents()) {
                this.registerContainer(childComponent, false)
            }
        }
        if (autoMount) {
            this._treeRoot.add(component)
        }
    }

    unregisterContainer(component: TreeComponent) {
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

    emitTreeChangeEvent() {

        const treeData: TreeData = {
            tree: this._treeRoot.toData(0).children
        }

        const elements = this._treeRoot.getComponents()

        treeElementSubject.next(treeData)
    }

    getNextName() {
        this._lastNameIndex++;
        return this._lastNameIndex.toString()
    }

}


