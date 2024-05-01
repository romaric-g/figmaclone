import { Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { Editor } from "../../editor";
import { SelectionLayer } from "../layers/selection";
import { DragSelectionState } from "../../tools/selectStates/dragSelection";
import { MovableSelectionState } from "../../tools/selectStates/movableSelection";
import { getDrawingCoveredRect } from "../../utils/getDrawingCoveredRect";
import { drawCross } from "../../utils/drawCross";

export class StickyLineRenderer {

    private graphics: Graphics;
    private movableSelectionState: MovableSelectionState;

    constructor(movableSelectionState: MovableSelectionState) {
        this.graphics = new Graphics()
        this.movableSelectionState = movableSelectionState;
    }

    render() {
        const editor = Editor.getEditor()

        const rects = editor.treeManager.getTree().getAllRects()
        const selectionRects = editor.selectionManager.getSelection().getAllRects()
        const otherRects = rects.filter((r) => !selectionRects.includes(r))

        const drawingCovered = getDrawingCoveredRect(editor.selectionManager.getSelection().getAllRects())

        if (drawingCovered === undefined) {
            return;
        }

        const xs = otherRects.map((r) => [r.x, r.x + r.width, r.x, r.x + r.width]).flat()
        const ys = otherRects.map((r) => [r.y, r.y, r.y + r.height, r.y + r.height]).flat()

        const { minX, minY, maxX, maxY } = drawingCovered;

        const minXIndexs = xs.map((_x, i) => [_x, i]).filter(([_x, _]) => _x === minX).map(([_x, i]) => i)
        const maxXIndexs = xs.map((_x, i) => [_x, i]).filter(([_x, _]) => _x === maxX).map(([_x, i]) => i)
        const minYIndexs = ys.map((_y, i) => [_y, i]).filter(([_y, _]) => _y === minY).map(([_y, i]) => i)
        const maxYIndexs = ys.map((_y, i) => [_y, i]).filter(([_y, _]) => _y === maxY).map(([_y, i]) => i)

        const mergedIndexs = [...minXIndexs, ...maxXIndexs, ...minYIndexs, ...maxYIndexs];
        const uniqueIndexs: number[] = [];

        for (const num of mergedIndexs) {
            if (!uniqueIndexs.includes(num)) {
                uniqueIndexs.push(num);
            }
        }


        const commonContext = new GraphicsContext()

        const minOrigin = editor.getCanvasPosition(new Point(minX, minY))
        const maxOrigin = editor.getCanvasPosition(new Point(maxX, maxY))

        for (const index of uniqueIndexs) {
            const drawPoint = editor.getCanvasPosition(new Point(xs[index], ys[index]))

            drawCross(commonContext, drawPoint.x, drawPoint.y)
        }

        if (minXIndexs.length > 0) {
            drawCross(commonContext, minOrigin.x, minOrigin.y)
            drawCross(commonContext, minOrigin.x, maxOrigin.y)
        }

        if (maxXIndexs.length > 0) {
            drawCross(commonContext, maxOrigin.x, minOrigin.y)
            drawCross(commonContext, maxOrigin.x, maxOrigin.y)
        }

        if (minYIndexs.length > 0) {
            drawCross(commonContext, minOrigin.x, minOrigin.y)
            drawCross(commonContext, maxOrigin.x, minOrigin.y)
        }

        if (maxYIndexs.length > 0) {
            drawCross(commonContext, minOrigin.x, maxOrigin.y)
            drawCross(commonContext, maxOrigin.x, maxOrigin.y)
        }





        this.graphics.zIndex = 10000;
        this.graphics.context = commonContext
        this.graphics.x = 0
        this.graphics.y = 0;

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