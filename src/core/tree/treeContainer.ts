import { TreeRect } from "./treeRect"
import { TreeComponent } from "./treeComponent"
import { ContainerSelectionBox } from "../canvas/renderer/containerSelectionBox";
import { Editor } from "../editor";
import { TreeContainerData } from "../../ui/subjects";
import { Point } from "pixi.js";
import { getDrawingCoveredRect } from "../utils/getDrawingCoveredRect";
import { SerialisedTreeComponent } from "./serialized/serialisedTreeComponent";
import { SerialisedTreeContainer } from "./serialized/serialisedTreeContainer";

export class TreeContainer extends TreeComponent<TreeContainerData> {

    private components: TreeComponent[] = []
    private selectionRenderer: ContainerSelectionBox;
    private _selected: boolean = false;
    private _hover: boolean = false;
    private _initialized: boolean = false;

    constructor(name: string) {
        super(name)
        this.selectionRenderer = new ContainerSelectionBox(this)
    }

    init(resetId: boolean) {
        if (!this._initialized) {
            super.init(resetId)

            for (const childComponent of this.getComponents()) {
                childComponent.init(resetId)
            }

            const selectionLayer = Editor.getEditor().canvasApp.getSelectionLayer()
            this.selectionRenderer.init(selectionLayer)
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

            const selectionLayer = Editor.getEditor().canvasApp.getSelectionLayer()
            this.selectionRenderer.destroy(selectionLayer)
            this._initialized = false
        }
    }

    add(element: TreeComponent): void {
        this.components.push(element);
        element.updateParentContainerCache(this);
    }

    addAtIndex(element: TreeComponent, index: number): void {
        if (index >= 0 && index <= this.components.length) {
            this.components.splice(index, 0, element);
            element.updateParentContainerCache(this);
        } else {
            this.add(element)
        }
    }

    remove(element: TreeComponent): void {
        const index = this.components.indexOf(element);
        if (index !== -1) {
            this.components.splice(index, 1);
            element.updateParentContainerCache(undefined)
        }
    }

    isEmpty() {
        return this.components.length === 0
    }

    getComponents(): TreeComponent[] {
        return this.components;
    }

    getDepthComponents() {
        const depthComponents: TreeComponent[] = []

        for (const component of this.components) {
            if (component instanceof TreeContainer) {
                depthComponents.push(component, ...component.getDepthComponents())
            } else {
                depthComponents.push(component)
            }
        }

        return depthComponents;
    }

    getAllRects() {
        const depthRects: TreeRect[] = []

        for (const component of this.components) {
            if (component instanceof TreeContainer) {
                depthRects.push(...component.getAllRects())
            } else if (component instanceof TreeRect) {
                depthRects.push(component)
            }
        }

        return depthRects;
    }

    getContainer(depthIndex: number[]): TreeContainer | undefined {
        if (depthIndex) {
            const indexElement = this.getComponent(depthIndex)
            if (indexElement instanceof TreeContainer) {
                return indexElement
            }
            return undefined;
        }
        return this;
    }

    getComponent(depthIndex: number[]): TreeComponent | undefined {
        let depthIndexShifted = [...depthIndex]
        const currentIndex = depthIndexShifted.shift()

        if (currentIndex === undefined) {
            return this;
        }

        const element = this.components[currentIndex]

        if (element instanceof TreeContainer) {
            return element.getComponent(depthIndexShifted)
        }

        if (depthIndexShifted.length > 0) {
            return undefined;
        }

        return element;
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
        return this.components.findIndex((c) => c == treeComponent)
    }

    getCanvasCoveredRect(): { minX: number; minY: number; maxX: number; maxY: number; } | undefined {

        const drawingCovered = getDrawingCoveredRect(this.getAllRects())

        if (!drawingCovered) {
            return undefined;
        }

        const editor = Editor.getEditor()

        const minOrigin = editor.getCanvasPosition(new Point(drawingCovered.minX, drawingCovered.minY))
        const maxOrigin = editor.getCanvasPosition(new Point(drawingCovered.maxX, drawingCovered.maxY))

        return {
            minX: minOrigin.x,
            minY: minOrigin.y,
            maxX: maxOrigin.x,
            maxY: maxOrigin.y
        }
    }

    serialize(): SerialisedTreeContainer {
        return new SerialisedTreeContainer({
            name: this.getName(),
            id: this.getId(),
            components: this.getComponents().map((c) => c.serialize())
        })
    }


    public static deserialize(serialisedTreeContainer: SerialisedTreeContainer) {

        const newContainer = new TreeContainer(serialisedTreeContainer.props.name)

        newContainer.components = serialisedTreeContainer.props.components.map((stc) => {
            const component = stc.deserialize()

            component.updateParentContainerCache(newContainer)

            return component;
        })

        newContainer._id = serialisedTreeContainer.props.id;

        return newContainer;

    }

}