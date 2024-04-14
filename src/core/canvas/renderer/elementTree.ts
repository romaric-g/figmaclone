import { Graphics, GraphicsContext } from "pixi.js";
import { Element } from "../../element";
import { TreeLayer } from "../layers/tree";

export class ElementTreeRenderer {

    private graphics: Graphics;
    private element: Element;

    constructor(element: Element) {
        this.graphics = new Graphics()
        this.element = element;
    }

    init(treeLayer: TreeLayer) {
        treeLayer.getContainer().addChild(this.graphics)
    }

    destroy(treeLayer: TreeLayer) {
        treeLayer.getContainer().removeChild(this.graphics)
    }

    render(zIndex: number) {
        const commonContext = new GraphicsContext()
            .rect(0, 0, this.element.width, this.element.height)
            .fill(this.element.fill)

        this.graphics.zIndex = zIndex;
        this.graphics.context = commonContext
        this.graphics.x = this.element.x
        this.graphics.y = this.element.y
    }

    getContainer() {
        return this.graphics;
    }

}