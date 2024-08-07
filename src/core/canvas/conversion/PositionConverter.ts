import { Container, Point } from "pixi.js";
import { SquaredZone } from "../../utils/squaredZone";

export class PositionConverter {

    private graphicsContainer: Container;

    constructor(graphicsContainer: Container) {
        this.graphicsContainer = graphicsContainer;
    }

    getDrawingSize(width: number, height: number) {
        const scale = this.graphicsContainer.scale

        return [width / scale.x, height / scale.y]
    }

    getCanvasSize(width: number, height: number) {
        const scale = this.graphicsContainer.scale

        return [scale.x * width, scale.y * height]
    }

    getDrawingPosition(canvasPosition: Point) {
        return this.graphicsContainer.toLocal(canvasPosition)
    }

    getCanvasPosition(drawingPosition: Point) {
        return this.graphicsContainer.toGlobal(drawingPosition)
    }

    getDrawingSquaredZone(canvasZone: SquaredZone): SquaredZone {
        const minPoint = this.getDrawingPosition(new Point(canvasZone.minX, canvasZone.maxX))
        const maxPoint = this.getDrawingPosition(new Point(canvasZone.minY, canvasZone.maxY))

        return {
            minX: minPoint.x,
            minY: minPoint.y,
            maxX: maxPoint.x,
            maxY: maxPoint.y
        }
    }

    getCanvasSquaredZone(drawingZone: SquaredZone): SquaredZone {
        const minPoint = this.getCanvasPosition(new Point(drawingZone.minX, drawingZone.minY))
        const maxPoint = this.getCanvasPosition(new Point(drawingZone.maxX, drawingZone.maxY))

        return {
            minX: minPoint.x,
            minY: minPoint.y,
            maxX: maxPoint.x,
            maxY: maxPoint.y
        }
    }

}