import { Anchor } from "./anchor";

export class AnchorContainer<T> extends Anchor<T> {
    private _anchors: Anchor<T>[] = []

    add(anchor: Anchor<T>, index: number = -1) {
        const currentContainer = anchor.getAnchorContainer()
        if (currentContainer) {
            currentContainer.remove(anchor)
        }

        if (index >= 0 && index <= this._anchors.length) {
            this._anchors.splice(index, 0, anchor);
        } else {
            this._anchors.push(anchor)
        }

        anchor.attach(this)
    }

    remove(anchor: Anchor<T>) {
        this._anchors = this._anchors.filter(a => a !== anchor);
        anchor.detach()
    }

    set(newAnchors: Anchor<T>[]) {
        this.clear()
        for (const anchor of newAnchors) {
            this.add(anchor)
        }
    }

    clear() {
        for (const anchor of this.anchors) {
            this.remove(anchor)
        }
    }

    getChildAnchor(indexs: number[]): Anchor<T> | undefined {
        let indexsShifted = [...indexs]
        const currentIndex = indexsShifted.shift()

        if (currentIndex === undefined) {
            return this;
        }

        const element = this.anchors[currentIndex]

        if (element instanceof AnchorContainer) {
            return element.getChildAnchor(indexsShifted)
        }

        if (indexsShifted.length > 0) {
            return undefined;
        }

        return element;
    }


    getChildAnchorContainer(indexs: number[]): AnchorContainer<T> | undefined {
        if (indexs) {
            const indexElement = this.getChildAnchor(indexs)
            if (indexElement instanceof AnchorContainer) {
                return indexElement
            }
            return undefined;
        }
        return this
    }

    getDepthAnchors() {
        const depthAnchors: Anchor<T>[] = []

        for (const anchor of this.anchors) {
            if (anchor instanceof AnchorContainer) {
                depthAnchors.push(anchor, ...anchor.anchors)
            } else {
                depthAnchors.push(anchor)
            }
        }

        return depthAnchors;
    }

    get anchors() {
        return this._anchors;
    }

    get lenght() {
        return this._anchors.length;
    }
}