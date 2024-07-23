import { Graphics, GraphicsContext, Point } from "pixi.js";
import { DragSelectionState } from "../../tools/selectStates/dragSelection";
import { Editor } from "../../editor";


export class DragSelectionBoxRenderer {

    private graphics: Graphics;
    private dragSelectionState: DragSelectionState;

    constructor(dragSelectionState: DragSelectionState) {
        this.graphics = new Graphics()
        this.dragSelectionState = dragSelectionState;
    }

    render() {
        const editor = Editor.getEditor()

        const coveredRect = this.dragSelectionState.getCoveredRect()

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
        const selectionLayer = Editor.getEditor().canvasApp.getSelectionLayer()

        selectionLayer.getContainer().addChild(this.graphics)
    }

    destroy() {
        const selectionLayer = Editor.getEditor().canvasApp.getSelectionLayer()

        selectionLayer.getContainer().removeChild(this.graphics)
    }

}