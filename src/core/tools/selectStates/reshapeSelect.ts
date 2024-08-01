import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { SelectToolState } from "./abstractSelectState";
import { SelectionState } from "./selection";
import { Editor } from "../../editor";
import { StickyLineReshapeRenderer } from "../../canvas/renderer/stickyLineReshape";
import { UpdateSelectionPropertiesAction } from "../../actions/updateSelectionPropertiesAction";


export type ReshapeReference = "none" | "top" | "left" | "bottom" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"

export type CursorType = "ns-resize" | "ew-resize" | "nesw-resize" | "nwse-resize" | "default"

export function getCursorType(reshapeReference: ReshapeReference): CursorType {
    switch (reshapeReference) {
        case "top":
            return "ns-resize";
        case "left":
            return "ew-resize"
        case "bottom":
            return "ns-resize"
        case "right":
            return "ew-resize"
        case "top-left":
            return "nwse-resize"
        case "top-right":
            return "nesw-resize"
        case "bottom-left":
            return "nesw-resize"
        case "bottom-right":
            return "nwse-resize"
        default:
            return "default"
    }
}

export class ReshapeSelectState extends SelectToolState {

    private stickyLineReshapeRenderer: StickyLineReshapeRenderer;

    private reshapeReference: ReshapeReference;
    private element: TreeRect;
    private sourceClickedPosition: Point;

    private originalX: number = 0;
    private originalY: number = 0;
    private originalWidth: number = 0;
    private originalHeight: number = 0;

    private stickyRight = false;
    private stickyLeft = false;
    private stickyTop = false;
    private stickyBottom = false;

    constructor(selectTool: SelectTool, element: TreeRect, reshapeReference: ReshapeReference, sourceClickedPosition: Point) {
        super(selectTool)
        this.reshapeReference = reshapeReference;
        this.element = element;
        this.sourceClickedPosition = sourceClickedPosition.clone();
        this.stickyLineReshapeRenderer = new StickyLineReshapeRenderer(this)
    }

    private getMouvementVector(currentPointerPosition: Point) {
        const x = currentPointerPosition.x - this.sourceClickedPosition.x;
        const y = currentPointerPosition.y - this.sourceClickedPosition.y;

        return new Point(x, y)
    }


    onInit(): void {
        const editor = Editor.getEditor()

        this.originalX = this.element.x;
        this.originalY = this.element.y;
        this.originalWidth = this.element.width;
        this.originalHeight = this.element.height;
        this.stickyLineReshapeRenderer.init(editor.canvasApp.getSelectionLayer())
    }
    onDestroy(): void {
        const editor = Editor.getEditor()

        this.stickyLineReshapeRenderer.destroy(editor.canvasApp.getSelectionLayer())
    }
    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point): void {
    }
    onClickUp(element: TreeRect, shift: boolean): void {
        this.selectTool.setState(new SelectionState(this.selectTool))
    }
    onMove(newPosition: Point): void {
        const editor = Editor.getEditor()
        const localPosition = editor.getDrawingPosition(newPosition).clone()

        const moveVector = this.getMouvementVector(localPosition)

        let newX = this.originalX;
        let newY = this.originalY;
        let newWidth = this.originalWidth;
        let newHeight = this.originalHeight;

        this.stickyRight = false;
        this.stickyLeft = false;
        this.stickyTop = false;
        this.stickyBottom = false;

        if (this.reshapeReference === "top" || this.reshapeReference === "top-left" || this.reshapeReference === "top-right") {
            this.stickyTop = true

            newY = this.originalY + moveVector.y
            newHeight = this.originalHeight - moveVector.y
            if (newHeight < 0) {
                newY = newY + newHeight
                newHeight = Math.abs(newHeight)
            }
        }
        if (this.reshapeReference === "bottom" || this.reshapeReference === "bottom-left" || this.reshapeReference === "bottom-right") {
            this.stickyBottom = true

            newHeight = this.originalHeight + moveVector.y
            if (newHeight < 0) {
                newY = newY + newHeight
                newHeight = Math.abs(newHeight)
            }
        }
        if (this.reshapeReference === "left" || this.reshapeReference === "top-left" || this.reshapeReference === "bottom-left") {
            this.stickyLeft = true

            newX = this.originalX + moveVector.x
            newWidth = this.originalWidth - moveVector.x
            if (newWidth < 0) {
                newX = newX + newWidth
                newWidth = Math.abs(newWidth)
            }
        }
        if (this.reshapeReference === "right" || this.reshapeReference === "top-right" || this.reshapeReference === "bottom-right") {
            this.stickyRight = true

            newWidth = this.originalWidth + moveVector.x
            if (newWidth < 0) {
                newX = newX + newWidth
                newWidth = Math.abs(newWidth)
            }
        }

        const stickyShape = this.getStickyReshape(newX, newY, newWidth, newHeight)
        const selection = editor.selectionManager.getSelection()

        editor.actionManager.push(
            new UpdateSelectionPropertiesAction(
                selection,
                (selection) => {
                    selection.setX(stickyShape.x)
                    selection.setY(stickyShape.y)
                    selection.setWidth(stickyShape.width)
                    selection.setHeight(stickyShape.height)
                }
            )
        )
    }

    getStickyReshape(x: number, y: number, width: number, height: number) {

        const editor = Editor.getEditor()

        const allComponents = editor.treeManager.getTree().getComponents()
        const allRects = allComponents.filter(r => r instanceof TreeRect)
        const allOtherRects = allRects.filter((r) => r !== this.element)

        const minX = x;
        const maxX = x + width;
        const minY = y;
        const maxY = y + height;

        const othersX = allOtherRects.map((e) => [e.x, e.x + e.width]).flat()
        const othersY = allOtherRects.map((e) => [e.y, e.y + e.height]).flat()

        let newX = x;
        let newY = y;
        let newWidth = width;
        let newHeight = height;

        if (this.stickyLeft) {
            const neerMinX = othersX.sort((x1, x2) => Math.abs(minX - x1) - Math.abs(minX - x2))[0]

            if (Math.abs(neerMinX - minX) < 10) {
                newX = neerMinX
                newWidth = newWidth + (minX - neerMinX)
            }
        }

        if (this.stickyRight) {
            const neerMaxX = othersX.sort((x1, x2) => Math.abs(maxX - x1) - Math.abs(maxX - x2))[0]

            if (Math.abs(neerMaxX - maxX) < 10) {
                newWidth = neerMaxX - newX
            }
        }

        if (this.stickyTop) {
            const neerMinY = othersY.sort((x1, x2) => Math.abs(minY - x1) - Math.abs(minY - x2))[0]

            if (Math.abs(neerMinY - minY) < 10) {
                newY = neerMinY
                newHeight = newHeight + (minY - neerMinY)
            }
        }

        if (this.stickyBottom) {
            const neerMaxY = othersY.sort((x1, x2) => Math.abs(maxY - x1) - Math.abs(maxY - x2))[0]

            if (Math.abs(neerMaxY - maxY) < 10) {
                newHeight = neerMaxY - newY
            }
        }

        return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
        }

    }

    getStickyInfo() {
        return {
            left: this.stickyLeft,
            right: this.stickyRight,
            top: this.stickyTop,
            bottom: this.stickyBottom
        }
    }

    onBackgroundPointerDown(clickPosition: Point): void {
    }
    onBackgroundPointerUp(clickPosition: Point): void {
        this.selectTool.setState(new SelectionState(this.selectTool))
    }

    render() {
        this.stickyLineReshapeRenderer.render()
    }

}