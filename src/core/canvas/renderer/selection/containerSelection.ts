import { Container, Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeContainer } from "../../../tree/treeContainer";
import { CachableRenderer } from "../cachableRenderer";
import { PositionConverter } from "../../conversion/PositionConverter";

export class ContainerSelectionRenderer implements CachableRenderer {

    private graphicsContainer: Container;
    private container: TreeContainer;
    private graphics: Graphics;
    private positionConverter: PositionConverter;

    constructor(container: TreeContainer, graphicsContainer: Container, positionConverter: PositionConverter) {
        this.graphics = new Graphics()
        this.graphicsContainer = graphicsContainer;
        this.container = container;
        this.positionConverter = positionConverter;
    }

    render(startIndex: number) {
        if (!this.container.isSelected() && !this.container.isHover()) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const drawingCoveredZone = this.container.getSquaredZone()

        if (!drawingCoveredZone) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const coveredRect = this.positionConverter.getCanvasSquaredZone(drawingCoveredZone)

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

    onInit() {
        this.graphicsContainer.addChild(this.graphics)
    }

    onDestroy() {
        this.graphicsContainer.removeChild(this.graphics)
    }

    getContainer() {
        return this.graphics;
    }

}