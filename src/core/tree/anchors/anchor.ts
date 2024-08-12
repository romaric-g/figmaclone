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

    getParentIndex() {
        if (this._anchorContainer) {
            const index = this._anchorContainer.anchors.indexOf(this)

            if (index === -1) {
                throw "inconsitent possition in parent anchor"
            }

            return index
        }
        return undefined;
    }

    getRootIndexs(leafIndexs: number[] = []): number[] {
        const index = this.getParentIndex()
        const parent = this.getAnchorContainer()

        if (index == undefined || !parent) {
            return leafIndexs;
        }

        return parent.getRootIndexs([index, ...leafIndexs])
    }

    get component() {
        return this._component;
    }

}