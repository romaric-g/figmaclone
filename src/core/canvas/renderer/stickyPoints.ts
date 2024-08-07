import { Container, Graphics, GraphicsContext, Point } from "pixi.js";
import { drawCross } from "../../utils/drawCross";
import { SquaredZone } from "../../utils/squaredZone";
import { Editor } from "../../editor";

export interface StickyInfo {
    left: boolean,
    right: boolean,
    top: boolean,
    bottom: boolean
}

export class StickyPointsRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;
    private editor: Editor;

    constructor(graphicsContainer: Container, editor: Editor) {
        this.graphicsContainer = graphicsContainer;
        this.graphics = new Graphics()
        this.editor = editor;
    }

    render(stickyInfo: StickyInfo | undefined, selectionZone: SquaredZone | undefined, otherZones: SquaredZone[], showLinesMatched = false) {

        if (!stickyInfo || !selectionZone) {
            this.graphics.context = new GraphicsContext()
            return;
        }

        const candidatePoints: Point[] = [];

        for (const zone of otherZones) {
            candidatePoints.push(new Point(zone.minX, zone.minY))
            candidatePoints.push(new Point(zone.maxX, zone.minY))
            candidatePoints.push(new Point(zone.minX, zone.maxY))
            candidatePoints.push(new Point(zone.maxX, zone.maxY))
        }

        const { left, right, top, bottom } = stickyInfo;
        const { minX: leftX, minY: topY, maxX: rightX, maxY: bottomY } = selectionZone;

        const stickyMatched: StickyInfo = {
            top: false,
            bottom: false,
            left: false,
            right: false
        }

        const filtredPoints = candidatePoints.filter((point) => {
            if (left && point.x === leftX) {
                stickyMatched.left = true;
                return true;
            }
            if (right && point.x === rightX) {
                stickyMatched.right = true;
                return true;
            }
            if (top && point.y === topY) {
                stickyMatched.top = true;
                return true;
            }
            if (bottom && point.y == bottomY) {
                stickyMatched.bottom = true;
                return true;
            }

            return false;
        })

        const seen = new Set<string>();

        const uniquePoints = filtredPoints.filter(point => {
            const key = `${point.x},${point.y}`;
            if (seen.has(key)) {
                return false;
            } else {
                seen.add(key);
                return true;
            }
        });

        const commonContext = new GraphicsContext()

        for (const point of uniquePoints) {
            const drawPoint = this.editor.positionConverter.getCanvasPosition(point)

            drawCross(commonContext, drawPoint.x, drawPoint.y)
        }

        if (showLinesMatched) {
            if (stickyMatched.left) {
                drawCross(commonContext, leftX, topY)
                drawCross(commonContext, leftX, bottomY)
            }
            if (stickyMatched.right) {
                drawCross(commonContext, rightX, topY)
                drawCross(commonContext, rightX, bottomY)
            }
            if (stickyMatched.top) {
                drawCross(commonContext, leftX, topY)
                drawCross(commonContext, rightX, topY)
            }
            if (stickyMatched.bottom) {
                drawCross(commonContext, leftX, bottomY)
                drawCross(commonContext, rightX, bottomY)
            }
        }

        this.graphics.zIndex = 10000;
        this.graphics.context = commonContext
        this.graphics.x = 0
        this.graphics.y = 0;

    }

    init() {
        this.graphicsContainer.addChild(this.graphics)
    }

    destroy() {
        this.graphicsContainer.removeChild(this.graphics)
    }



}