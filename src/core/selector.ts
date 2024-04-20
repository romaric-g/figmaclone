import { Editor } from "./editor";
import { Selection } from "./selections/selection";
import { TreeComponent } from "./tree/treeComponent";
import { TreeContainer } from "./tree/treeContainer";


export class Selector {
    private _selection: Selection;
    private _innerPositionContainer?: TreeContainer;

    constructor() {
        this._selection = new Selection([])
    }

    setSelection(selection: Selection) {
        if (this._selection.isSameSelection(selection)) {
            return;
        }

        this._selection.destroy()
        this._selection = selection;
        this._selection.init()
        this._selection.emitChangeEvent()

        Editor.getEditor().treeManager.emitTreeChangeEvent()
    }

    getSelection() {
        return this._selection;
    }

    unselectAll() {
        this.setSelection(new Selection([]))
    }

    getInnerPositionContainer() {
        if (this._innerPositionContainer) {
            return this._innerPositionContainer;
        }
        return Editor.getEditor().treeManager.getTree()
    }

    restoreInitialPositionContainer() {
        this._innerPositionContainer = undefined;
    }

    getInnerTopComponent(component: TreeComponent): TreeComponent {
        const parentContainer = component.getContainerParent()

        if (!parentContainer) {
            return component;
        }

        if (parentContainer === this.getInnerPositionContainer()) {
            return component;
        }

        return this.getInnerTopComponent(parentContainer)
    }
}
