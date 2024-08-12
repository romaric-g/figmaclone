import { SelectedComponentsModifier } from "./selectedComponentsModifier";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";
import { SerialisedTreeComponentList } from "../tree/serialized/serialisedTreeComponentList";


export class SelectionManager {

    private _selectionModifier: SelectedComponentsModifier;
    private _copiedComponents?: SerialisedTreeComponentList;

    constructor() {
        this._selectionModifier = new SelectedComponentsModifier([])
    }

    init() {
    }

    setSelectionModifier(selection: SelectedComponentsModifier) {
        if (this._selectionModifier.isSameSelection(selection)) {
            return;
        }

        this._selectionModifier.destroy()
        this._selectionModifier = selection;
        this._selectionModifier.init()
    }

    getSelectionModifier() {
        return this._selectionModifier;
    }

    unselectAll() {
        this.setSelectionModifier(new SelectedComponentsModifier([]))
    }

    getComponentsChainFromRoot(component: TreeComponent, componentsChain: TreeComponent[] = []): TreeComponent[] {

        const parentContainer = component.getAnchor().getAnchorContainer()

        const newComponentsChain = [component].concat(componentsChain)

        if (!parentContainer || !(parentContainer.component instanceof TreeContainer)) {
            return newComponentsChain;
        }


        const parentDepthComponents = parentContainer.component.getDepthComponents()

        for (const selectedComponent of this.getSelectionModifier().getComponents()) {
            if (parentDepthComponents.includes(selectedComponent)) {
                return newComponentsChain;
            }
        }

        if (parentContainer.component.getAnchor().getAnchorContainer() === undefined) {
            return newComponentsChain;
        }

        return this.getComponentsChainFromRoot(parentContainer.component, newComponentsChain)
    }

    copySelection() {
        this._copiedComponents = this._selectionModifier.serializeComponents()
    }

    getCopiedSelection(): SerialisedTreeComponentList | undefined {
        return this._copiedComponents;
    }

}
