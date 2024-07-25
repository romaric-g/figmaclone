import { Point } from "pixi.js";
import { TreeRect } from "../tree/treeRect";
import { SelectionData } from "../../ui/subjects";
import { SelectionBuilder } from "./selectionBuilder";
import { Editor } from "../editor";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";
import { HsvaColor } from "@uiw/react-color";
import { getDrawingCoveredRect } from "../utils/getDrawingCoveredRect";
import { findMinimumDifference } from "../utils/findMinimumDifference";
import { SerializedSelection } from "./serialized/serializedSelection";

export class Selection {
    private _components: TreeComponent[]

    constructor(components: TreeComponent[]) {
        this._components = components;
    }

    private applyToEachRect(apply: (rectComponent: TreeRect) => void) {
        for (const component of this.getFlatComponents()) {
            if (component instanceof TreeRect) {
                apply(component)
            }
        }
    }

    private getRectsValue<T>(apply: (rectComponent: TreeRect) => T) {
        const values: T[] = []

        for (const component of this.getFlatComponents()) {
            if (component instanceof TreeRect) {
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


    private getRectsObjectValue<T>(apply: (rectComponent: TreeRect) => T) {
        const values: T[] = []

        this.getAllRects()

        for (const component of this.getFlatComponents()) {
            if (component instanceof TreeRect) {
                values.push(apply(component))
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

    isSameSelection(selection: Selection) {
        const components = this.getFlatComponents()
        const otherComponents = selection.getFlatComponents()

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

    getFlatComponents() {
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
        this.applyToEachRect((c) => c.fillColor = fillColor)
    }

    getFillColor() {
        return this.getRectsObjectValue((e) => e.fillColor)
    }

    setHeight(value: number) {
        this.applyToEachRect((c) => c.height = value)
    }

    getHeight() {
        return this.getRectsValue((e) => e.height)
    }

    setWidth(value: number) {
        this.applyToEachRect((c) => c.width = value)
    }


    getWidth() {
        return this.getRectsValue((e) => e.width)
    }

    setX(value: number) {
        this.applyToEachRect((c) => c.x = value)
    }

    addX(value: number) {
        this.applyToEachRect((c) => c.x = c.x + value)
    }

    getX() {
        return this.getRectsValue((e) => e.x)
    }

    setY(value: number) {
        this.applyToEachRect((c) => c.y = value)
    }

    addY(value: number) {
        this.applyToEachRect((c) => c.y = c.y + value)
    }

    getY() {
        return this.getRectsValue((e) => e.y)
    }

    getBorderWidth() {
        return this.getRectsValue((e) => e.borderWidth)
    }

    setBorderWidth(newWidth: number) {
        this.applyToEachRect((c) => c.borderWidth = newWidth)
    }

    setBorderColor(newColor: HsvaColor) {
        this.applyToEachRect((c) => c.borderColor = newColor)
    }

    getBorderColor() {
        return this.getRectsObjectValue((e) => e.borderColor)
    }


    getAllRects() {
        const rects: TreeRect[] = []

        for (const component of this.getComponents()) {
            if (component instanceof TreeRect) {
                rects.push(component)
            }
            if (component instanceof TreeContainer) {
                rects.push(...component.getAllRects())
            }
        }

        return rects
    }


    getStickyMoveVector(moveVector: Point) {
        const selectionRects = this.getAllRects()
        const drawingCovered = getDrawingCoveredRect(selectionRects, true)

        let stickyX = undefined;
        let stickyY = undefined;

        if (!drawingCovered) {
            return {
                vector: moveVector,
                stickyX,
                stickyY
            };
        }

        drawingCovered.minX += moveVector.x;
        drawingCovered.maxX += moveVector.x;
        drawingCovered.minY += moveVector.y;
        drawingCovered.maxY += moveVector.y;

        const editor = Editor.getEditor()

        const rects = editor.treeManager.getTree().getAllRects().filter((r) => !selectionRects.includes(r))

        const xs = rects.map((r) => [r.x, r.x + r.width]).flat()
        const ys = rects.map((r) => [r.y, r.y + r.height]).flat()

        const sel_xs = [drawingCovered.minX, drawingCovered.maxX]
        const sel_ys = [drawingCovered.minY, drawingCovered.maxY]

        if (xs.length === 0 || sel_xs.length === 0) {
            return {
                vector: moveVector,
                stickyX,
                stickyY
            };
        }

        const [x, sel_x, min_diff_x] = findMinimumDifference(xs, sel_xs);
        const [y, sel_y, min_diff_y] = findMinimumDifference(ys, sel_ys);

        const newMoveVector = moveVector.clone()

        if (min_diff_x < 10) {
            newMoveVector.x = x - (sel_x - moveVector.x)
            stickyX = x
        }

        if (min_diff_y < 10) {
            newMoveVector.y = y - (sel_y - moveVector.y)
            stickyY = y
        }

        return {
            vector: newMoveVector,
            stickyX,
            stickyY
        }
    }



    mouseIsIn(canvasPosition: Point) {
        const selectionRects = this.getAllRects()
        const drawingCovered = getDrawingCoveredRect(selectionRects)

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
        const moveRect = (rect: TreeRect) => {
            const movePositionOrigin = rect.getOriginalPosition()

            const newX = movePositionOrigin.x + moveVector.x
            const newY = movePositionOrigin.y + moveVector.y

            rect.setPosition(newX, newY)
        }

        this.applyToEachRect(moveRect)
    }

    freezeMoveOrigin() {
        this.applyToEachRect((e) => e.freezeOriginalPosition())
    }

    unfreezeMoveOrigin() {
        this.applyToEachRect((e) => e.unfreezeOriginalPosition())
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
        const lenght = this.getFlatComponents().length
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

    serialize(): SerializedSelection {
        return {
            components: this.getComponents().map((c) => c.serialize())
        }
    }

    getSelectedIds(): string[] {
        return this._components.map((c) => c.getId()).filter((c) => !!c) as string[]
    }

}