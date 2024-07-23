import { Editor } from "../editor";
import { SelectionManager } from "./selectionManager";
import { Selection } from "./selection";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";

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

        this.clean()

        return this;
    }

    clean() {
        const toRemove = []

        for (const containerComponent of this._components) {
            if (containerComponent instanceof TreeContainer) {
                for (const otherComponent of this._components) {
                    if (containerComponent.getDepthComponents().includes(otherComponent)) {
                        toRemove.push(otherComponent)
                    }
                }
            }
        }

        this.remove(...toRemove)

        this._components = Array.from(new Set(this._components))

        return this;
    }

    remove(...components: TreeComponent[]) {
        this._components = this._components.filter(el => !components.includes(el));
        return this;
    }

    build() {
        return new Selection(this._components)
    }
}