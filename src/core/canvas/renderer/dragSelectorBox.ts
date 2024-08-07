import { Container, Graphics, GraphicsContext, Point } from "pixi.js";
import { DragSelectionState } from "../../tools/selectStates/dragSelection";

export class DragSelectionBoxRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;

    constructor(graphicsContainer: Container) {
        this.graphics = new Graphics()
        this.graphicsContainer = graphicsContainer;
    }

    render(dragSelectionState?: DragSelectionState) {
        if (!dragSelectionState) {
            this.graphics.context = new GraphicsContext();
            return;
        }

        const coveredRect = dragSelectionState.getCanvasCoveredZone()

        if (!coveredRect) {
            return
        }

        const { minX, minY, maxX, maxY } = coveredRect;

        const boxOrigin = new Point(minX, minY)

        let boxWidth = maxX - minX;
        let boxHeight = maxY - minY;

        const strokeStyle = {
            width: 1,
            color: "blue"
        }

        const commonContext = new GraphicsContext()
            .rect(0, 0, boxWidth, boxHeight)
            .fill({
                r: 0,
                g: 0,
                b: 200,
                a: 0.2
            })
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

}