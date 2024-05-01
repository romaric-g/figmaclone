import { Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { Editor } from "../../editor";
import { SelectionLayer } from "../layers/selection";
import { DragSelectionState } from "../../tools/selectStates/dragSelection";
import { MovableSelectionState } from "../../tools/selectStates/movableSelection";
import { getDrawingCoveredRect } from "../../utils/getDrawingCoveredRect";
import { ReshapeSelectState } from "../../tools/selectStates/reshapeSelect";
import { drawCross } from "../../utils/drawCross";

export class StickyLineReshapeRenderer {

    private graphics: Graphics;
    private reshapeSelectState: ReshapeSelectState;

    constructor(reshapeSelectState: ReshapeSelectState) {
        this.graphics = new Graphics()
        this.reshapeSelectState = reshapeSelectState;
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

        const mergedIndexs: number[] = []

        const { left, right, top, bottom } = this.reshapeSelectState.getStickyInfo()

        if (left) {
            mergedIndexs.push(...xs.map((_x, i) => [_x, i]).filter(([_x, _]) => _x === minX).map(([_x, i]) => i))
        }

        if (right) {
            mergedIndexs.push(...xs.map((_x, i) => [_x, i]).filter(([_x, _]) => _x === maxX).map(([_x, i]) => i))
        }

        if (top) {
            mergedIndexs.push(...ys.map((_y, i) => [_y, i]).filter(([_y, _]) => _y === minY).map(([_y, i]) => i))
        }

        if (bottom) {
            mergedIndexs.push(...ys.map((_y, i) => [_y, i]).filter(([_y, _]) => _y === maxY).map(([_y, i]) => i))
        }

        const uniqueIndexs: number[] = [];

        for (const num of mergedIndexs) {
            if (!uniqueIndexs.includes(num)) {
                uniqueIndexs.push(num);
            }
        }

        const commonContext = new GraphicsContext()

        for (const index of uniqueIndexs) {
            const drawPoint = editor.getCanvasPosition(new Point(xs[index], ys[index]))

            drawCross(commonContext, drawPoint.x, drawPoint.y)
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