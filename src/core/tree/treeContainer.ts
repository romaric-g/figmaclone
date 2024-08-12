import { TreeComponent, TreeComponentProps } from "./treeComponent"
import { TreeContainerData } from "../../ui/subjects";
import { getSquaredCoveredZone, SquaredZone } from "../utils/squaredZone";
import { SerialisedTreeContainer } from "./serialized/serialisedTreeContainer";
import { AnchorContainer } from "./anchors/anchorContainer";
import { TreeComponentVisitor } from "./treeComponentVisitor";

export class TreeContainer extends TreeComponent {

    // private components: TreeComponent[] = []

    private _anchorContainer: AnchorContainer<TreeComponent>;

    private _selected: boolean = false;
    private _hover: boolean = false;

    constructor(props: TreeComponentProps) {
        super(props)
        this._anchorContainer = new AnchorContainer(this)
    }

    destroy() {
        const children = [...this.getComponents()]

        for (const child of children) {
            child.destroy()
        }

        super.destroy()
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

    accept(visitor: TreeComponentVisitor): void {
        visitor.doForContainer(this)
    }

}