import { Editor } from "../editor";
import { Selector } from "../selector";
import { Selection } from "./selection";
import { TreeComponent } from "../tree/treeComponent";

export class SelectionBuilder {

    private _editor: Editor;
    private _components: TreeComponent[];

    constructor(editor: Editor) {
        this._editor = editor;
        this._components = []
    }

    removeAll() {
        this._components = []
        return this;
    }

    selectAll() {
        this._components = this._editor.treeManager.getTree().getAllRects()
        return this;
    }

    set(...compoents: TreeComponent[]) {
        this._components = compoents;
        return this;
    }

    add(...compoents: TreeComponent[]) {
        this._components.push(...compoents)
        return this;
    }

    remove(...components: TreeComponent[]) {
        this._components = this._components.filter(el => !components.includes(el));
        return this;
    }

    build() {
        return new Selection(this._components)
    }

    apply(selector: Selector) {
        selector.setSelection(this.build())
    }
}