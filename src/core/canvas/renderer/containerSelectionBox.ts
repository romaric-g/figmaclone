import { Graphics, GraphicsContext, Point } from "pixi.js";
import { Editor } from "../../editor";
import { TreeContainer } from "../../tree/treeContainer";

export class ContainerSelectionBoxRenderer {

    private container: TreeContainer;
    private graphics: Graphics;

    constructor(container: TreeContainer) {
        this.graphics = new Graphics()
        this.container = container
    }

    render() {
        const editor = Editor.getEditor()

        if (!this.container.isSelected() && !this.container.isHover()) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const drawingCoveredZone = this.container.getSquaredZone()

        if (!drawingCoveredZone) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const coveredRect = editor.getCanvasSquaredZone(drawingCoveredZone)

        const { minX, minY, maxX, maxY } = coveredRect

        let boxWidth = maxX - minX;
        let boxHeight = maxY - minY;

        const strokeStyle = {
            width: this.container.isSelected() ? 2 : 1,
            color: "blue"
        }

        const commonContext = new GraphicsContext()
            .rect(0, 0, boxWidth, boxHeight)
            .stroke(strokeStyle)

        this.graphics.zIndex = 10000;
        this.graphics.context = commonContext;
        this.graphics.x = minX;
        this.graphics.y = minY;

    }

    init() {
        Editor.getEditor().canvasApp.getSelectionLayer().getContainer().addChild(this.graphics)
    }

    destroy() {
        Editor.getEditor().canvasApp.getSelectionLayer().getContainer().removeChild(this.graphics)
    }

    getContainer() {
        return this.graphics;
    }

}