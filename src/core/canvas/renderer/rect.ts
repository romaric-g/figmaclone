import { Graphics, GraphicsContext } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { TreeLayer } from "../layers/tree";

export class RectRenderer {

    private graphics: Graphics;
    private element: TreeRect;

    constructor(element: TreeRect) {
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
            .fill(this.element.fillColor)
            .stroke({
                width: this.element.borderWidth,
                color: this.element.borderColor,
                alignment: 1
            })

        this.graphics.zIndex = zIndex;
        this.graphics.context = commonContext
        this.graphics.x = this.element.x
        this.graphics.y = this.element.y
    }

    getContainer() {
        return this.graphics;
    }

}