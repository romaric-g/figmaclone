import { AnchorContainer } from "./anchorContainer";

export class Anchor<T> {

    private _component: T;
    private _anchorContainer?: AnchorContainer<T>;

    constructor(component: T) {
        this._component = component;
    }

    attach(anchorContainer: AnchorContainer<T>) {
        this._anchorContainer = anchorContainer;
    }

    detach() {
        this._anchorContainer = undefined
    }

    getAnchorContainer() {
        return this._anchorContainer;
    }

    get component() {
        return this._component;
    }

}