import { Point } from "pixi.js";
import { Tool } from "./tool";
import { TreeBox } from "../tree/treeBox";
import { StickyLineDrawRenderer } from "../canvas/renderer/stickyLineDraw";
import { ToolType } from "./toolManager";
import { Editor } from "../editor";
import { cursorChangeSubject } from "../../ui/subjects";
import { PointerDownEventData, PointerMoveEventData, PointerUpEventData } from "../event/eventManager";
import { TreeRect } from "../tree/treeRect";
import { CreateRectStartAction } from "../actions/createElementStartAction";
import { SelectTool } from "./selectTool";
import { SelectionState } from "./selectStates/selection";
import { Selection } from "../selections/selection";
import { SetSelectionAction } from "../actions/setSelectionAction";
import { UpdateSelectionPropertiesAction } from "../actions/updateSelectionPropertiesAction";


export abstract class DrawTool extends Tool {
    private activate = false;
    private pressDownPosition?: Point;
    private stickyLineDrawRenderer: StickyLineDrawRenderer;
    private drawingBox?: TreeBox;

    constructor(toolType: ToolType) {
        super(toolType)

        this.onPointerDown = this.onPointerDown.bind(this)
        this.onPointerUp = this.onPointerUp.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)

        this.stickyLineDrawRenderer = new StickyLineDrawRenderer(this)
    }

    enable() {
        if (!this.activate) {
            const editor = Editor.getEditor()

            editor.eventsManager.onPointerDown.subscribe(this.onPointerDown)
            editor.eventsManager.onPointerUp.subscribe(this.onPointerUp)
            editor.eventsManager.onPointerMove.subscribe(this.onPointerMove)

            cursorChangeSubject.next("crosshair")

            this.stickyLineDrawRenderer.init(editor.canvasApp.getSelectionLayer())
            this.activate = true;
        }
    }

    disable() {
        if (this.activate) {
            const editor = Editor.getEditor()

            editor.eventsManager.onPointerDown.unsubscribe(this.onPointerDown)
            editor.eventsManager.onPointerUp.unsubscribe(this.onPointerUp)
            editor.eventsManager.onPointerMove.unsubscribe(this.onPointerMove)

            cursorChangeSubject.next("default")

            this.stickyLineDrawRenderer.destroy(editor.canvasApp.getSelectionLayer())
            this.activate = false;
        }
    }

    onPointerDown({ position, button }: PointerDownEventData) {
        if (button === 1) {
            return;
        }

        const editor = Editor.getEditor()

        const localPostion = editor.getDrawingPosition(position).clone()

        this.pressDownPosition = localPostion.clone()

        this.drawingBox = this.getNewDrawingBox(localPostion.x, localPostion.y)
        this.drawingBox.onSelectionInit()

        editor.actionManager.push(
            new CreateRectStartAction(this.drawingBox)
        )
    }

    onPointerUp({ button }: PointerUpEventData) {
        if (button === 1) {
            return;
        }

        const editor = Editor.getEditor()

        if (this.drawingBox) {
            editor.selectionManager.setSelection(new Selection([this.drawingBox]))
            editor.toolManager.setCurrentTool("select")

            editor.actionManager.push(
                new SetSelectionAction(editor.selectionManager.getSelection())
            )

            const currentTool = editor.toolManager.getCurrentTool()
            if (currentTool instanceof SelectTool) {
                currentTool.setState(new SelectionState(currentTool))
            }
        }
        this.pressDownPosition = undefined;
        this.drawingBox = undefined;
    }

    private stickyRight = false;
    private stickyLeft = false;
    private stickyTop = false;
    private stickyBottom = false;

    onPointerMove({ position }: PointerMoveEventData) {
        const editor = Editor.getEditor()
        const localPostion = editor.getDrawingPosition(position).clone()

        if (this.pressDownPosition && this.drawingBox) {
            const moveVectorX = localPostion.x - this.pressDownPosition.x
            const moveVectorY = localPostion.y - this.pressDownPosition.y

            this.stickyRight = false;
            this.stickyLeft = false;
            this.stickyTop = false;
            this.stickyBottom = false;

            if (moveVectorX < 0) {
                this.stickyLeft = true
            } else if (moveVectorX > 0) {
                this.stickyRight = true
            }

            if (moveVectorY < 0) {
                this.stickyTop = true
            } else if (moveVectorY > 0) {
                this.stickyBottom = true
            }

            const newX = this.pressDownPosition.x + (moveVectorX > 0 ? 0 : moveVectorX)
            const newY = this.pressDownPosition.y + (moveVectorY > 0 ? 0 : moveVectorY)
            const newWidth = Math.abs(moveVectorX)
            const newHeight = Math.abs(moveVectorY)

            const stickyReshape = this.getStickyReshape(newX, newY, newWidth, newHeight)

            const selection = editor.selectionManager.getSelection()

            editor.actionManager.push(
                new UpdateSelectionPropertiesAction(selection, (selection) => {
                    selection.setX(stickyReshape.x)
                    selection.setY(stickyReshape.y)
                    selection.setWidth(stickyReshape.width)
                    selection.setHeight(stickyReshape.height)
                })
            )
        }
    }

    getStickyReshape(x: number, y: number, width: number, height: number) {

        const editor = Editor.getEditor()

        const allOtherRects = editor.treeManager.getTree().getAllRects().filter((r) => r !== this.drawingBox)

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

    render() {
        this.stickyLineDrawRenderer.render()
    }

    abstract getNewDrawingBox(x: number, y: number): TreeBox

}