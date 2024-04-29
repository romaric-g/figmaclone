import { FillStyleInputs, Point } from "pixi.js";
import { TreeRect } from "../tree/treeRect";
import { selectionChangeSubject } from "../../ui/subjects";
import { SelectionBuilder } from "./selectionBuilder";
import { Editor } from "../editor";
import { TreeComponent } from "../tree/treeComponent";
import { TreeContainer } from "../tree/treeContainer";
import { HsvaColor, RgbaColor } from "@uiw/react-color";

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
            color: this.getFillColor()
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