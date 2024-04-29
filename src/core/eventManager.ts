import { Point } from "pixi.js";
import { TreeRect } from "./tree/treeRect";
import { TreeComponent } from "./tree/treeComponent";

type EventHandler<T> = (data: T) => void;

class EventManager<T> {
    private handlers: EventHandler<T>[] = new Array();

    subscribe(handler: EventHandler<T>): void {
        this.handlers.push(handler);
    }

    unsubscribe(handler: EventHandler<T>): void {
        const index = this.handlers.indexOf(handler);
        if (index !== -1) {
            this.handlers.splice(index, 1);
        }
    }

    emit(data: T): void {
        this.handlers.forEach(handler => {
            handler(data);
        });
    }
}

export type ElementPressDownEventData = { element: TreeRect, pointerPosition: Point }

export type ElementPressUpEventData = { element: TreeRect }

export type PointerMoveEventData = { position: Point }

export type PointerDownEventData = { position: Point, onBackground: boolean }

export type PointerUpEventData = { position: Point, onBackground: boolean }

export type PointerBackgroundEventData = { position: Point }

export type ElementOverOnEventData = { component: TreeComponent }

export type ElementOverOffEventData = { component: TreeComponent }

export class EventsManger {
    onElementPressDown = new EventManager<ElementPressDownEventData>()
    onElementPressUp = new EventManager<ElementPressUpEventData>()
    onElementHoverOn = new EventManager<ElementOverOnEventData>()
    onElementHoverOff = new EventManager<ElementOverOffEventData>()
    onBackgroundPressDown = new EventManager<PointerBackgroundEventData>()
    onBackgroundPressUp = new EventManager<PointerBackgroundEventData>()
    onPointerMove = new EventManager<PointerMoveEventData>()
    onPointerDown = new EventManager<PointerDownEventData>()
    onPointerUp = new EventManager<PointerUpEventData>()
}