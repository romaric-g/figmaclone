import { FillStyleInputs, Point } from "pixi.js";
import { TreeRect } from "../tree/treeRect";
import { selectionChangeSubject } from "../../ui/subjects";
import { SelectionBuilder } from "./selectionBuilder";
import { Editor } from "../editor";
import { TreeComponent } from "../tree/treeComponent";

export class Selection {
    private _components: TreeComponent[]

    constructor(components: TreeComponent[]) {
        this._components = components;
    }

    private applyToEachRect(apply: (rectComponent: TreeRect) => void) {
        for (const component of this._components) {
            if (component instanceof TreeRect) {
                apply(component)
            }
        }
    }

    private getRectsValue<T>(apply: (rectComponent: TreeRect) => T) {
        const values: T[] = []

        for (const component of this._components) {
            if (component instanceof TreeRect) {
                values.push(apply(component))
            }
        }

        if (values.length > 1) {
            return "mixed"
        }
        return values[0]
    }

    init() {
        for (const component of this._components) {
            if (component instanceof TreeRect) {
                component.onSelectionInit()
            }
        }
    }

    destroy() {
        this.applyToEachRect((c) => c.onSelectionDestroy())
    }

    getBuilder(editor: Editor) {
        const newBuilder = new SelectionBuilder(editor)
        newBuilder.set(...this._components)
        return newBuilder;
    }

    isSameSelection(selection: Selection) {
        const components = this.getComponents()
        const otherComponents = selection.getComponents()

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

    getComponents() {
        return this._components;
    }

    setFillColor(color: FillStyleInputs) {
        this.applyToEachRect((c) => c.fill = color)
        this.emitChangeEvent()
    }

    getFillColor() {
        return this.getRectsValue((e) => e.fill)
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
            lenght: this.getComponents().length,
            x: this.getX(),
            y: this.getY(),
            width: this.getWidth(),
            height: this.getHeight(),
            color: this.getFillColor()
        })
    }

}