import { Editor } from "../editor";
import { Element } from "../element";
import { Selector } from "../selector";
import { Selection } from "./selection";

export class SelectionBuilder {

    private _editor: Editor;
    private _elements: Element[];

    constructor(editor: Editor) {
        this._editor = editor;
        this._elements = []
    }

    removeAll() {
        this._elements = []
        return this;
    }

    selectAll() {
        this._elements = this._editor.tree.getAllElements()
        return this;
    }

    set(...elements: Element[]) {
        this._elements = elements;
        return this;
    }

    add(...elements: Element[]) {
        this._elements.push(...elements)
        return this;
    }

    remove(...elements: Element[]) {
        this._elements = this._elements.filter(el => !elements.includes(el));
        return this;
    }

    build() {
        return new Selection(this._elements)
    }

    apply(selector: Selector) {
        selector.setSelection(this.build())
    }
}