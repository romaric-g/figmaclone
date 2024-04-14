import { Graphics, GraphicsContext, Point } from "pixi.js";
import { Element } from "../../element";
import { Editor } from "../../editor";
import { SelectionLayer } from "../layers/selection";

export class ElementSelectorRenderer {

    private graphics: Graphics;
    private element: Element;

    constructor(element: Element) {
        this.graphics = new Graphics()
        this.element = element;
    }

    render(zIndex: number) {
        const editor = Editor.getEditor()

        if (!this.element.isHover() && !this.element.isSelected()) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const startPoint = editor.getCanvasPosition(new Point(this.element.x, this.element.y))
        const [width, height] = editor.getCanvasSize(this.element.width, this.element.height)

        console.log(width, height)

        const commonContext = new GraphicsContext()
            .rect(0, 0, width, height)

        if (this.element.isSelected()) {
            const strokeStyle = {
                width: 2,
                color: "blue"
            }
            commonContext.stroke(strokeStyle)

            if (this.element.getContextEditor()?.selector.getSelection().getElements().length == 1) {
                commonContext.rect(-4, -4, 8, 8).fill("white").stroke(strokeStyle)
                commonContext.rect(-4, height - 4, 8, 8).fill("white").stroke(strokeStyle)
                commonContext.rect(width - 4, -4, 8, 8).fill("white").stroke(strokeStyle)
                commonContext.rect(width - 4, height - 4, 8, 8).fill("white").stroke(strokeStyle)
            }
        }


        if (this.element.isHover() && !this.element.isSelected()) {
            commonContext
                .stroke({
                    width: 1,
                    color: "blue"
                })
        }

        this.graphics.zIndex = zIndex;
        this.graphics.context = commonContext;
        this.graphics.x = startPoint.x;
        this.graphics.y = startPoint.y;

    }

    init(selectionLayer: SelectionLayer) {
        selectionLayer.getContainer().addChild(this.graphics)
    }

    destroy(selectionLayer: SelectionLayer) {
        selectionLayer.getContainer().removeChild(this.graphics)
    }

    getContainer() {
        return this.graphics;
    }

}