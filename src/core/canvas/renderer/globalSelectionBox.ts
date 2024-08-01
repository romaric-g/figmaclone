import { Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { Editor } from "../../editor";
import { SelectionLayer } from "../layers/selection";

export class GlobalSelectionBoxRenderer {

    private graphics: Graphics;

    constructor() {
        this.graphics = new Graphics()
    }

    render() {
        const editor = Editor.getEditor()
        const components = editor.selectionManager.getSelection().getDepthComponents()

        let minX = undefined
        let minY = undefined
        let maxX = undefined
        let maxY = undefined


        for (const component of components) {
            if (component instanceof TreeRect) {

                if (minX == undefined || component.x < minX) {
                    minX = component.x
                }
                if (minY === undefined || component.y < minY) {
                    minY = component.y
                }
                if (maxX === undefined || component.x + component.width > maxX) {
                    maxX = component.x + component.width
                }
                if (maxY === undefined || component.y + component.height > maxY) {
                    maxY = component.y + component.height
                }
            }
        }

        if (minX === undefined || minY === undefined || maxX === undefined || maxY === undefined) {
            this.graphics.context = new GraphicsContext();
            return
        }

        let width = maxX - minX;
        let height = maxY - minY;

        const boxOrigin = editor.getCanvasPosition(new Point(minX, minY))
        const [boxWidth, boxHeight] = editor.getCanvasSize(width, height)

        const strokeStyle = {
            width: 1,
            color: "blue"
        }



        const commonContext = new GraphicsContext()
            .rect(0, 0, boxWidth, boxHeight)
            .stroke(strokeStyle)

        this.graphics.zIndex = 10000;
        this.graphics.context = commonContext;
        this.graphics.x = boxOrigin.x;
        this.graphics.y = boxOrigin.y;

    }

    init(selectionLayer: SelectionLayer) {
        Editor.getEditor().canvasApp.getSelectionLayer().getContainer().addChild(this.graphics)
    }

    destroy(selectionLayer: SelectionLayer) {
        Editor.getEditor().canvasApp.getSelectionLayer().getContainer().removeChild(this.graphics)
    }

    getContainer() {
        return this.graphics;
    }

}