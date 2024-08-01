import { GlobalSelectionBoxRenderer } from "../canvas/renderer/globalSelectionBox";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "./selectedComponentsModifier";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";
import { SerialisedTreeComponentList } from "../tree/serialized/serialisedTreeComponentList";


export class SelectionManager {

    private _selection: SelectedComponentsModifier;
    private _globalSelectionBoxRenderer: GlobalSelectionBoxRenderer;
    private _copiedComponents?: SerialisedTreeComponentList;

    constructor() {
        this._selection = new SelectedComponentsModifier([])
        this._globalSelectionBoxRenderer = new GlobalSelectionBoxRenderer()
    }

    init() {
        this._globalSelectionBoxRenderer.init(Editor.getEditor().canvasApp.getSelectionLayer())
    }

    setSelection(selection: SelectedComponentsModifier) {
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
        this.setSelection(new SelectedComponentsModifier([]))
    }

    getRootContainer() {
        return Editor.getEditor().treeManager.getTree()
    }

    getComponentsChainFromRoot(component: TreeComponent, componentsChain: TreeComponent[] = []): TreeComponent[] {

        const parentContainer = component.getAnchor().getAnchorContainer()

        const newComponentsChain = [component].concat(componentsChain)

        if (!parentContainer || !(parentContainer.component instanceof TreeContainer)) {
            return newComponentsChain;
        }


        const parentDepthComponents = parentContainer.component.getDepthComponents()

        for (const selectedComponent of this.getSelection().getComponents()) {
            if (parentDepthComponents.includes(selectedComponent)) {
                return newComponentsChain;
            }
        }

        if (parentContainer.component === this.getRootContainer()) {
            return newComponentsChain;
        }

        return this.getComponentsChainFromRoot(parentContainer.component, newComponentsChain)
    }

    render() {
        this._globalSelectionBoxRenderer.render()
    }


    copySelection() {
        this._copiedComponents = this._selection.serializeComponents()
    }

    getCopiedSelection(): SerialisedTreeComponentList | undefined {
        return this._copiedComponents;
    }

}
