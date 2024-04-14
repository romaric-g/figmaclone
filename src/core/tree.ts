import { Container } from "pixi.js";
import { Element } from "./element";
import { Editor } from "./editor";
import { TreeElementData } from "../ui/tree/treeElement";
import { treeElementSubject } from "../ui/subjects";

export class Tree {
    private _editor: Editor;
    private _treeContainer: Container;
    private _elements: Element[] = []

    constructor(editor: Editor) {
        this._editor = editor;
        this._treeContainer = editor.getTreeContainer();
    }

    getAllElements() {
        return this._elements;
    }

    addElement(element: Element) {
        this._elements.push(element)
        element.init(this._editor)

        this.emitTreeChangeEvent()
    }

    removeElement(element: Element) {
        const index = this._elements.indexOf(element);
        if (index !== -1) {
            this._elements.splice(index, 1);
        }
        element.destroy()

        this.emitTreeChangeEvent()
    }

    changeIndex(element: Element, newIndex: number) {
        const currentIndex = this._elements.indexOf(element);
        if (currentIndex !== -1) {
            this._elements.splice(currentIndex, 1);

            if (newIndex < 0) {
                newIndex = 0;
            } else if (newIndex >= this._elements.length) {
                newIndex = this._elements.length;
            }

            this._elements.splice(newIndex, 0, element);
        }
    }

    render() {
        for (let index = 0; index < this._elements.length; index++) {
            const element = this._elements[index];
            element.render(index)
        }
    }

    emitTreeChangeEvent() {
        const treeElements: TreeElementData[] = []

        for (let index = 0; index < this._elements.length; index++) {

            treeElements.push({
                index: index,
                name: "Rect" + index
            })
        }

        treeElementSubject.next(treeElements)
    }

}


