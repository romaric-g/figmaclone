import { FillStyleInputs, Point } from "pixi.js";
import { Element } from "../element";
import { selectionChangeSubject } from "../../ui/subjects";
import { SelectionBuilder } from "./selectionBuilder";
import { Editor } from "../editor";

export class Selection {
    private _elements: Element[]

    constructor(elements: Element[]) {
        this._elements = elements;
    }

    init() {
        for (const element of this._elements) {
            element.onSelectionInit()
        }
    }

    destroy() {
        for (const element of this._elements) {
            element.onSelectionDestroy()
        }
    }

    getBuilder(editor: Editor) {
        const newBuilder = new SelectionBuilder(editor)
        newBuilder.set(...this._elements)
        return newBuilder;
    }

    isSameSelection(selection: Selection) {
        const elements = this.getElements()
        const otherElements = selection.getElements()

        if (elements.length !== otherElements.length) {
            return false;
        }

        return elements.every(e => otherElements.includes(e));
    }

    getElements() {
        return this._elements;
    }

    setFillColor(color: FillStyleInputs) {
        for (const element of this._elements) {
            element.fill = color
        }

        this.emitChangeEvent()
    }

    getFillColor() {
        const fillColors = this._elements.map((e) => e.fill)

        if (fillColors.length > 1) {
            return "mixed"
        }
        return fillColors[0]
    }

    setHeight(value: number) {
        for (const element of this._elements) {
            element.height = value
        }

        this.emitChangeEvent()
    }

    getHeight() {
        const heights = this._elements.map((e) => e.height)

        if (heights.length > 1) {
            return "mixed"
        }
        return heights[0]
    }

    setWidth(value: number) {
        for (const element of this._elements) {
            element.width = value
        }

        this.emitChangeEvent()
    }


    getWidth() {
        const widths = this._elements.map((e) => e.width)

        if (widths.length > 1) {
            return "mixed"
        }
        return widths[0]
    }

    setX(value: number) {
        for (const element of this._elements) {
            element.x = value
        }

        this.emitChangeEvent()
    }

    getX() {
        const xs = this._elements.map((e) => e.x)

        if (xs.length > 1) {
            return "mixed"
        }
        return xs[0]
    }

    setY(value: number) {
        for (const element of this._elements) {
            element.y = value
        }

        this.emitChangeEvent()
    }

    getY() {
        const ys = this._elements.map((e) => e.y)

        if (ys.length > 1) {
            return "mixed"
        }
        return ys[0]
    }

    move(moveVector: Point) {
        for (const element of this._elements) {
            const movePositionOrigin = element.getOriginalPosition()

            const newX = movePositionOrigin.x + moveVector.x
            const newY = movePositionOrigin.y + moveVector.y

            element.setPosition(newX, newY)
        }
        this.emitChangeEvent()
    }

    freezeMoveOrigin() {
        for (const element of this._elements) {
            element.freezeOriginalPosition()
        }
    }

    unfreezeMoveOrigin() {
        for (const element of this._elements) {
            element.unfreezeOriginalPosition()
        }
    }

    emitChangeEvent() {
        selectionChangeSubject.next({
            lenght: this.getElements().length,
            x: this.getX(),
            y: this.getY(),
            width: this.getWidth(),
            height: this.getHeight(),
            color: this.getFillColor()
        })
    }

}