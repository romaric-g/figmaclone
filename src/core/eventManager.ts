import { Point } from "pixi.js";
import { Element } from "./element";

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

export type ElementPressDownEventData = { element: Element, pointerPosition: Point }

export type ElementPressUpEventData = { element: Element }

export type PointerMoveEventData = { position: Point }

export type PointerDownEventData = { position: Point, onBackground: boolean }

export type PointerUpEventData = { position: Point, onBackground: boolean }

export type PointerBackgroundEventData = { position: Point }

export class EventsManger {
    onElementPressDown = new EventManager<ElementPressDownEventData>()
    onElementPressUp = new EventManager<ElementPressUpEventData>()
    onBackgroundPressDown = new EventManager<PointerBackgroundEventData>()
    onBackgroundPressUp = new EventManager<PointerBackgroundEventData>()
    onPointerMove = new EventManager<PointerMoveEventData>()
    onPointerDown = new EventManager<PointerDownEventData>()
    onPointerUp = new EventManager<PointerUpEventData>()
}