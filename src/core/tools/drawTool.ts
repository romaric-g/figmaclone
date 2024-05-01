import { Point } from "pixi.js";
import { Editor } from "../editor";
import { ElementPressDownEventData, ElementPressUpEventData, PointerDownEventData, PointerMoveEventData, PointerUpEventData } from "../eventManager";
import { Tool } from "./tool";
import { TreeRect } from "../tree/treeRect";
import { SelectTool } from "./selectTool";
import { SelectToolState } from "./selectStates/abstractSelectState";
import { SelectionState } from "./selectStates/selection";
import { Selection } from "../selections/selection";
import { cursorChangeSubject } from "../../ui/subjects";


export class DrawTool extends Tool {
    private pressDownPosition?: Point;
    private drawingRect?: TreeRect;

    constructor(editor: Editor) {
        super(editor, "draw")

        this.onPointerDown = this.onPointerDown.bind(this)
        this.onPointerUp = this.onPointerUp.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)
    }

    enable() {
        this.editor.eventsManager.onPointerDown.subscribe(this.onPointerDown)
        this.editor.eventsManager.onPointerUp.subscribe(this.onPointerUp)
        this.editor.eventsManager.onPointerMove.subscribe(this.onPointerMove)

        cursorChangeSubject.next("crosshair")

    }

    disable() {
        this.editor.eventsManager.onPointerDown.unsubscribe(this.onPointerDown)
        this.editor.eventsManager.onPointerUp.unsubscribe(this.onPointerUp)
        this.editor.eventsManager.onPointerMove.unsubscribe(this.onPointerMove)

        cursorChangeSubject.next("default")
    }

    onPointerDown({ position, button }: PointerDownEventData) {
        if (button === 1) {
            return;
        }

        const localPostion = this.editor.getDrawingPosition(position).clone()

        this.pressDownPosition = localPostion.clone()
        this.drawingRect = new TreeRect({
            x: localPostion.x,
            y: localPostion.y,
            width: 0,
            height: 0,
            name: this.editor.treeManager.getNextName(),
            fillColor: {
                h: 0,
                s: 0,
                v: 80,
                a: 1
            }
        })
        this.drawingRect.onSelectionInit()
        this.editor.treeManager.registerContainer(this.drawingRect, true)

        this.editor.selectionManager.setSelection(new Selection([this.drawingRect]))
    }

    onPointerUp({ button }: PointerUpEventData) {
        if (button === 1) {
            return;
        }

        if (this.drawingRect) {
            this.editor.selectionManager.setSelection(new Selection([this.drawingRect]))
            this.editor.toolManager.setCurrentTool("select")

            const currentTool = this.editor.toolManager.getCurrentTool()
            if (currentTool instanceof SelectTool) {
                currentTool.setState(new SelectionState(currentTool))
            }
        }
        this.pressDownPosition = undefined;
        this.drawingRect = undefined;
    }

    onPointerMove({ position }: PointerMoveEventData) {
        const localPostion = this.editor.getDrawingPosition(position).clone()

        if (this.pressDownPosition && this.drawingRect) {
            const moveVectorX = localPostion.x - this.pressDownPosition.x
            const moveVectorY = localPostion.y - this.pressDownPosition.y

            this.drawingRect.x = this.pressDownPosition.x + (moveVectorX > 0 ? 0 : moveVectorX)
            this.drawingRect.y = this.pressDownPosition.y + (moveVectorY > 0 ? 0 : moveVectorY)
            this.drawingRect.width = Math.abs(moveVectorX)
            this.drawingRect.height = Math.abs(moveVectorY)
        }
    }

}