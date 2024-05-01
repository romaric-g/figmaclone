import { Point } from "pixi.js";
import { TreeRect } from "../tree/treeRect";
import { selectionChangeSubject } from "../../ui/subjects";
import { SelectionBuilder } from "./selectionBuilder";
import { Editor } from "../editor";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";
import { HsvaColor } from "@uiw/react-color";
import { getDrawingCoveredRect } from "../utils/getDrawingCoveredRect";
import { findMinimumDifference } from "../utils/findMinimumDifference";

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
            return "mixed"
        }

        return valuesSet[0]
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
        this.emitChangeEvent()
    }

    getFillColor() {
        return this.getRectsValue((e) => e.fillColor)
    }

    setHeight(value: number) {
        this.applyToEachRect((c) => c.height = value)
        this.emitChangeEvent()
    }

    getHeight() {
        return this.getRectsValue((e) => e.height)
    }

    setWidth(value: number) {
        this.applyToEachRect((c) => c.width = value)
        this.emitChangeEvent()
    }


    getWidth() {
        return this.getRectsValue((e) => e.width)
    }

    setX(value: number) {
        this.applyToEachRect((c) => c.x = value)
        this.emitChangeEvent()
    }

    addX(value: number) {
        this.applyToEachRect((c) => c.x = c.x + value)
        this.emitChangeEvent()
    }

    getX() {
        return this.getRectsValue((e) => e.x)
    }

    setY(value: number) {
        this.applyToEachRect((c) => c.y = value)
        this.emitChangeEvent()
    }

    addY(value: number) {
        this.applyToEachRect((c) => c.y = c.y + value)
        this.emitChangeEvent()
    }

    getY() {
        return this.getRectsValue((e) => e.y)
    }

    getBorderWidth(): number | "mixed" {
        return this.getRectsValue((e) => e.borderWidth)
    }

    setBorderWidth(newWidth: number) {
        this.applyToEachRect((c) => c.borderWidth = newWidth)
        this.emitChangeEvent()
    }

    setBorderColor(newColor: HsvaColor) {
        this.applyToEachRect((c) => c.borderColor = newColor)
        this.emitChangeEvent()
    }

    getBorderColor(): "mixed" | HsvaColor {
        return this.getRectsValue((e) => e.borderColor)
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


    move(moveVector: Point) {
        const moveRect = (rect: TreeRect) => {
            const movePositionOrigin = rect.getOriginalPosition()

            const newX = movePositionOrigin.x + moveVector.x
            const newY = movePositionOrigin.y + moveVector.y

            rect.setPosition(newX, newY)
        }

        this.applyToEachRect(moveRect)
        this.emitChangeEvent()
    }

    freezeMoveOrigin() {
        this.applyToEachRect((e) => e.freezeOriginalPosition())
    }

    unfreezeMoveOrigin() {
        this.applyToEachRect((e) => e.unfreezeOriginalPosition())
    }

    emitChangeEvent() {
        selectionChangeSubject.next({
            lenght: this.getFlatComponents().length,
            x: this.getX(),
            y: this.getY(),
            width: this.getWidth(),
            height: this.getHeight(),
            color: this.getFillColor(),
            borderColor: this.getBorderColor(),
            borderWidth: this.getBorderWidth()
        })
    }

    getComponents() {
        return this._components;
    }

    getFirstIndexComponent() {
        for (const component of this._components) {
            console.log(component.getIndexsChain().join("."))
        }

        return this._components[0]
    }

    isEmpty() {
        return this._components.length === 0
    }

}