import { FederatedPointerEvent, Point } from "pixi.js";
import { TreeRect } from "../tree/treeRect";
import { TreeComponent } from "../tree/treeComponent";
import { TreeBox } from "../tree/treeBox";

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

export type ElementPressDownEventData = { element: TreeBox, pointerPosition: Point, button: number }

export type ElementPressUpEventData = { element: TreeBox, button: number }

export type PointerMoveEventData = { position: Point }

export type PointerDownEventData = { position: Point, onBackground: boolean, button: number }

export type PointerUpEventData = { position: Point, onBackground: boolean, button: number }

export type PointerBackgroundEventData = { position: Point, button: number }

export type ElementOverOnEventData = { component: TreeComponent }

export type ElementOverOffEventData = { component: TreeComponent }

export type ElementRightDownData = { element: TreeBox, pointerPosition: Point, originalEvent: FederatedPointerEvent }

export type PointerRightDownData = { pointerPosition: Point, originalEvent: FederatedPointerEvent }

export class EventsManger {
    onElementPressDown = new EventManager<ElementPressDownEventData>()
    onElementPressUp = new EventManager<ElementPressUpEventData>()
    onElementHoverOn = new EventManager<ElementOverOnEventData>()
    onElementHoverOff = new EventManager<ElementOverOffEventData>()
    onElementRightDown = new EventManager<ElementRightDownData>()
    onBackgroundPressDown = new EventManager<PointerBackgroundEventData>()
    onBackgroundPressUp = new EventManager<PointerBackgroundEventData>()
    onPointerMove = new EventManager<PointerMoveEventData>()
    onPointerDown = new EventManager<PointerDownEventData>()
    onPointerUp = new EventManager<PointerUpEventData>()
    onPointerRightDown = new EventManager<PointerRightDownData>()
}