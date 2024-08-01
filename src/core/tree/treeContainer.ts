import { TreeComponent, TreeComponentProps } from "./treeComponent"
import { ContainerSelectionBoxRenderer } from "../canvas/renderer/containerSelectionBox";
import { TreeContainerData } from "../../ui/subjects";
import { getSquaredCoveredZone, SquaredZone } from "../utils/squaredZone";
import { SerialisedTreeContainer } from "./serialized/serialisedTreeContainer";
import { AnchorContainer } from "./anchors/anchorContainer";

export class TreeContainer extends TreeComponent {

    // private components: TreeComponent[] = []

    private _anchorContainer: AnchorContainer<TreeComponent>;

    private selectionRenderer: ContainerSelectionBoxRenderer;
    private _selected: boolean = false;
    private _hover: boolean = false;
    private _initialized: boolean = false;

    constructor(props: TreeComponentProps) {
        super(props)
        this.selectionRenderer = new ContainerSelectionBoxRenderer(this)
        this._anchorContainer = new AnchorContainer(this)
    }

    init(resetId: boolean) {
        if (!this._initialized) {
            super.init(resetId)

            for (const childComponent of this.getComponents()) {
                childComponent.init(resetId)
            }

            this.selectionRenderer.init()
            this._initialized = true
        }
    }

    destroy() {
        if (this._initialized) {
            const children = [...this.getComponents()]

            for (const child of children) {
                child.destroy()
            }

            super.destroy()

            this.selectionRenderer.destroy()
            this._initialized = false
        }
    }

    isEmpty() {
        return this._anchorContainer.lenght === 0
    }

    getComponents(): TreeComponent[] {
        return this._anchorContainer.anchors.map((a) => a.component);
    }

    getDepthComponents() {
        return this._anchorContainer.getDepthAnchors().map((a) => a.component);
    }

    getChildComponent(depthIndex: number[]): TreeComponent | undefined {
        return this._anchorContainer.getChildAnchor(depthIndex)?.component
    }

    render(nextIndex: number): number {
        for (const component of this.getComponents()) {
            nextIndex = component.render(nextIndex)
        }

        this.selectionRenderer.render()

        return nextIndex
    }

    onSelectionInit() {
        this._selected = true;
    }

    onSelectionDestroy() {
        this._selected = false;
        this._hover = false;
    }

    isSelected() {
        return this._selected;
    }

    setHover(value: boolean) {
        this._hover = value;
    }

    isHover() {
        return this._hover;
    }

    toData(index: number): TreeContainerData {
        return ({
            type: "container",
            index: index,
            name: this.getName(),
            selected: this.isSelected(),
            children: this.getComponents().map((c, index) => c.toData(index))
        })
    }

    getIndexOfChild(treeComponent: TreeComponent) {
        return this.getComponents().findIndex((c) => c == treeComponent)
    }

    getSquaredZone(): SquaredZone | undefined {
        const squaredZones = this.getComponents().map(c => c.getSquaredZone()).filter(c => !!c)

        return getSquaredCoveredZone(squaredZones)
    }

    serialize(): SerialisedTreeContainer {
        return {
            type: "container",
            props: {
                name: this.getName(),
                id: this.getId(),
                components: this.getComponents().map((c) => c.serialize())
            }
        }
    }

    getAnchor(): AnchorContainer<TreeComponent> {
        return this._anchorContainer;
    }

}