import { Point } from "pixi.js";
import { TreeRect } from "../tree/treeRect";
import { SelectionData } from "../../ui/subjects";
import { SelectionBuilder } from "./selectionBuilder";
import { Editor } from "../editor";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";
import { HsvaColor } from "@uiw/react-color";
import { getSquaredCoveredZone } from "../utils/squaredZone";
import { TreeBox } from "../tree/treeBox";
import { SerialisedTreeComponentList } from "../tree/serialized/serialisedTreeComponentList";

export class SelectedComponentsModifier {
    private _components: TreeComponent[]

    constructor(components: TreeComponent[]) {
        this._components = components;
    }

    private applyToEachBox(apply: (boxComponent: TreeBox) => void) {
        for (const component of this.getDepthComponents()) {
            if (component instanceof TreeBox) {
                apply(component)
            }
        }
    }

    private getBoxsValue<T>(apply: (boxComponent: TreeBox) => T) {
        const values: T[] = []

        for (const component of this.getDepthComponents()) {
            if (component instanceof TreeBox) {
                values.push(apply(component))
            }
        }

        const valuesSet = Array.from(new Set(values))

        if (valuesSet.length > 1) {
            return "mixed";
        }

        if (valuesSet.length == 0) {
            return undefined;
        }

        return valuesSet[0];
    }


    private getBoxsObjectValue<T>(apply: (boxComponent: TreeBox) => T | undefined) {
        const values: T[] = []

        this.getAllRectComponents()

        for (const component of this.getDepthComponents()) {
            if (component instanceof TreeBox) {
                const value = apply(component)
                if (value !== undefined) {
                    values.push(value)
                }
            }
        }

        const map = new Map<string, T>();

        values.forEach(value => {
            const key = JSON.stringify(value);
            if (!map.has(key)) {
                map.set(key, value);
            }
        });

        const valuesSet = Array.from(map.values());

        if (valuesSet.length > 1) {
            return "mixed";
        }

        if (valuesSet.length == 0) {
            return undefined;
        }

        return valuesSet[0];
    }




    init() {
        for (const component of this._components) {
            if (component instanceof TreeRect) {
                component.onSelectionInit()
            }
            if (component instanceof TreeContainer) {
                component.onSelectionInit()
            }
        }
    }

    destroy() {
        for (const component of this._components) {
            if (component instanceof TreeRect) {
                component.onSelectionDestroy()
            }
            if (component instanceof TreeContainer) {
                component.onSelectionDestroy()
            }
        }
    }

    getBuilder(editor: Editor) {
        const newBuilder = new SelectionBuilder(editor)
        newBuilder.set(...this._components)
        return newBuilder;
    }

    isSameSelection(selection: SelectedComponentsModifier) {
        const components = this.getDepthComponents()
        const otherComponents = selection.getDepthComponents()

        if (components.length !== otherComponents.length) {
            return false;
        }

        for (let index = 0; index < components.length; index++) {
            const c1 = components[index]
            const c2 = otherComponents[index]

            if (c1 != c2) {
                return false;
            }
        }

        return true;
    }

    getDepthComponents() {
        const components: TreeComponent[] = []

        for (const component of this._components) {
            if (component instanceof TreeContainer) {
                components.push(...component.getDepthComponents())
            } else {
                components.push(component)
            }
        }


        return components;
    }

    setFillColor(fillColor: HsvaColor) {

        this.applyToEachBox((c) => {
            if (c instanceof TreeRect) {
                c.fillColor = fillColor
            }
        })
    }

    getFillColor() {
        return this.getBoxsObjectValue((c) => {
            if (c instanceof TreeRect) {
                return c.fillColor
            }
        })
    }

    setHeight(value: number) {
        this.applyToEachBox((c) => c.height = value)
    }

    getHeight() {
        return this.getBoxsValue((e) => e.height)
    }

    setWidth(value: number) {
        this.applyToEachBox((c) => c.width = value)
    }


    getWidth() {
        return this.getBoxsValue((e) => e.width)
    }

    setX(value: number) {
        this.applyToEachBox((c) => c.x = value)
    }

    addX(value: number) {
        this.applyToEachBox((c) => c.x = c.x + value)
    }

    getX() {
        return this.getBoxsValue((e) => e.x)
    }

    setY(value: number) {
        this.applyToEachBox((c) => c.y = value)
    }

    addY(value: number) {
        this.applyToEachBox((c) => c.y = c.y + value)
    }

    getY() {
        return this.getBoxsValue((e) => e.y)
    }

    getBorderWidth() {
        return this.getBoxsValue((e) => {
            if (e instanceof TreeRect) {
                return e.borderWidth
            }
        })
    }

    setBorderWidth(newWidth: number) {
        this.applyToEachBox((c) => {
            if (c instanceof TreeRect) {
                c.borderWidth = newWidth
            }
        })
    }

    setBorderColor(newColor: HsvaColor) {
        this.applyToEachBox((c) => {
            if (c instanceof TreeRect) {
                c.borderColor = newColor
            }
        })
    }

    getBorderColor() {
        return this.getBoxsObjectValue((e) => {
            if (e instanceof TreeRect) {
                return e.borderColor
            }
        })
    }


    getAllRectComponents() {
        return this.getDepthComponents().filter(c => c instanceof TreeRect)
    }

    mouseIsIn(canvasPosition: Point) {
        const selectionRects = this.getAllRectComponents()
        const drawingCovered = getSquaredCoveredZone(selectionRects.map(c => c.getSquaredZone()))

        const drawingPoint = Editor.getEditor().getDrawingPosition(canvasPosition)

        if (!drawingCovered) return false;

        const { minX, maxX, minY, maxY } = drawingCovered

        return (
            drawingPoint.x >= minX &&
            drawingPoint.x <= maxX &&
            drawingPoint.y >= minY &&
            drawingPoint.y <= maxY
        );
    }


    move(moveVector: Point) {

        console.log("new vector", moveVector)


        const moveRect = (box: TreeBox) => {
            const movePositionOrigin = box.getOriginalPosition()

            const newX = movePositionOrigin.x + moveVector.x
            const newY = movePositionOrigin.y + moveVector.y

            console.log("MOVE TO", [newX, newY])

            box.setPosition(newX, newY)
        }

        this.applyToEachBox(moveRect)
    }

    freezeMoveOrigin() {
        this.applyToEachBox((e) => e.freezeOriginalPosition())
    }

    unfreezeMoveOrigin() {
        this.applyToEachBox((e) => e.unfreezeOriginalPosition())
    }

    getComponents() {
        return this._components;
    }

    getFirstIndexComponent() {
        return this._components[0]
    }

    isEmpty() {
        return this._components.length === 0
    }

    toData(): SelectionData | undefined {
        const lenght = this.getDepthComponents().length
        const x = this.getX()
        const y = this.getY()
        const width = this.getWidth()
        const height = this.getHeight()
        const color = this.getFillColor()
        const borderColor = this.getBorderColor()
        const borderWidth = this.getBorderWidth()

        if (
            lenght == 0 ||
            x === undefined ||
            y === undefined ||
            width === undefined ||
            height === undefined ||
            color === undefined ||
            borderColor === undefined ||
            borderWidth === undefined
        ) {
            return undefined
        }

        return {
            lenght,
            x,
            y,
            width,
            height,
            color,
            borderColor,
            borderWidth
        }
    }

    serializeComponents(): SerialisedTreeComponentList {
        return {
            components: this.getComponents().map((c) => c.serialize())
        }
    }

    getSelectedIds(): string[] {
        return this._components.map((c) => c.getId()).filter((c) => !!c) as string[]
    }


}