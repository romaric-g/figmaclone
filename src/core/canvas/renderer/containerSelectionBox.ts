import { Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { Editor } from "../../editor";
import { SelectionLayer } from "../layers/selection";
import { TreeContainer } from "../../tree/treeContainer";

export class ContainerSelectionBox {

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

        const coveredRect = this.container.getCanvasCoveredRect()

        if (!coveredRect) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const { minX, minY, maxX, maxY } = coveredRect

        const boxOrigin = new Point(minX, minY)

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
        this.graphics.x = boxOrigin.x;
        this.graphics.y = boxOrigin.y;

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