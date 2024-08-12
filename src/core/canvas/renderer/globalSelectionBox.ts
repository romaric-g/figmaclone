import { Container, Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { Editor } from "../../editor";
import { SelectionLayer } from "../layers/selection";

export class GlobalSelectionBoxRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;

    constructor(graphicsContainer: Container) {
        this.graphics = new Graphics()
        this.graphicsContainer = graphicsContainer;
    }

    render() {
        const editor = Editor.getEditor()
        const components = editor.selectionManager.getSelectionModifier().getDepthComponents()

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

        const boxOrigin = editor.positionConverter.getCanvasPosition(new Point(minX, minY))
        const [boxWidth, boxHeight] = editor.positionConverter.getCanvasSize(width, height)

        const strokeStyle = {
            width: 1,
            color: "#0C8CE9"
        }



        const commonContext = new GraphicsContext()
            .rect(0, 0, boxWidth, boxHeight)
            .stroke(strokeStyle)

        this.graphics.zIndex = 10000;
        this.graphics.context = commonContext;
        this.graphics.x = boxOrigin.x;
        this.graphics.y = boxOrigin.y;

    }

    init() {
        this.graphicsContainer.addChild(this.graphics)
    }

    destroy() {
        this.graphicsContainer.removeChild(this.graphics)
    }

    getContainer() {
        return this.graphics;
    }

}