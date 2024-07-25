import { GlobalSelectionBoxRenderer } from "../canvas/renderer/globalSelectionBox";
import { Editor } from "../editor";
import { Selection } from "./selection";
import { TreeComponent } from "../tree/treeComponent";
import { SerializedSelection } from "./serialized/serializedSelection";


export class SelectionManager {

    private _selection: Selection;
    private _globalSelectionBoxRenderer: GlobalSelectionBoxRenderer;
    private _copiedSelection?: SerializedSelection;

    constructor() {
        this._selection = new Selection([])
        this._globalSelectionBoxRenderer = new GlobalSelectionBoxRenderer()
    }

    init() {
        this._globalSelectionBoxRenderer.init(Editor.getEditor().canvasApp.getSelectionLayer())
    }

    setSelection(selection: Selection) {
        if (this._selection.isSameSelection(selection)) {
            return;
        }

        this._selection.destroy()
        this._selection = selection;
        this._selection.init()
    }

    getSelection() {
        return this._selection;
    }

    unselectAll() {
        this.setSelection(new Selection([]))
    }

    getRootContainer() {
        return Editor.getEditor().treeManager.getTree()
    }

    getComponentsChainFromRoot(component: TreeComponent, componentsChain: TreeComponent[] = []): TreeComponent[] {

        const parentContainer = component.getParentContainer()

        const newComponentsChain = [component].concat(componentsChain)

        if (!parentContainer) {
            return newComponentsChain;
        }

        const parentDepthComponents = parentContainer.getDepthComponents()

        for (const selectedComponent of this.getSelection().getComponents()) {
            if (parentDepthComponents.includes(selectedComponent)) {
                return newComponentsChain;
            }
        }

        if (parentContainer === this.getRootContainer()) {
            return newComponentsChain;
        }

        return this.getComponentsChainFromRoot(parentContainer, newComponentsChain)
    }

    render() {
        this._globalSelectionBoxRenderer.render()
    }


    copySelection() {
        this._copiedSelection = this._selection.serialize()
    }

    getCopiedSelection(): SerializedSelection | undefined {
        return this._copiedSelection;
    }

}
