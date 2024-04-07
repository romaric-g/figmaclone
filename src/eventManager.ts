import { Point } from "pixi.js";

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

export const eventManagers = {
    "onElementPressDown": new EventManager<{ element: Element, pointerPosition: Point }>(),
    "onElementPressUp": new EventManager<{ element: Element, pointerPosition: Point }>(),
}