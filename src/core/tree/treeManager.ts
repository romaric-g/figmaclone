import { Container } from "pixi.js";
import { TreeRect } from "./treeRect";
import { Editor } from "../editor";
import { TreeElementData, treeElementSubject } from "../../ui/subjects";
import { TreeRoot } from "./treeRoot";
import { TreeComponent } from "./treeComponent";

export class TreeManager {

    private _editor: Editor;
    private _treeRoot: TreeRoot;
    private _lastNameIndex: number = 0;

    constructor(editor: Editor) {
        this._editor = editor;
        this._treeRoot = new TreeRoot()
    }

    init() {
        this.emitTreeChangeEvent()
    }

    getTree() {
        return this._treeRoot;
    }

    registerContainer(component: TreeComponent, autoMount = false) {
        component.init(this._editor)
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
        const treeElements: TreeElementData[] = []

        console.log("tree root", this._treeRoot)

        const elements = this._treeRoot.getAllRects()
        console.log("elements", elements)

        for (let index = 0; index < elements.length; index++) {

            treeElements.push({
                index: index,
                name: elements[index].name,
                selected: elements[index].isSelected()
            })
        }

        treeElementSubject.next(treeElements)
    }

    getNextName() {
        this._lastNameIndex++;
        return this._lastNameIndex.toString()
    }

}


