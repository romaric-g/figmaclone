import { Point } from "pixi.js";
import { Editor } from "../editor";
import { ElementPressDownEventData, ElementPressUpEventData, PointerDownEventData, PointerMoveEventData, PointerUpEventData } from "../eventManager";
import { Tool } from "./tool";
import { Element, Rect } from "../element";


export class DrawTool extends Tool {
    private pressDownPosition?: Point;
    private drawingRect?: Rect;

    constructor(editor: Editor) {
        super(editor, "draw")

        this.onPointerDown = this.onPointerDown.bind(this)
        this.onPointerUp = this.onPointerUp.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)

        console.log("create")
    }

    enable() {
        this.editor.eventsManager.onPointerDown.subscribe(this.onPointerDown)
        this.editor.eventsManager.onPointerUp.subscribe(this.onPointerUp)
        this.editor.eventsManager.onPointerMove.subscribe(this.onPointerMove)

        console.log("activate");

    }

    disable() {
        this.editor.eventsManager.onPointerDown.unsubscribe(this.onPointerDown)
        this.editor.eventsManager.onPointerUp.unsubscribe(this.onPointerUp)
        this.editor.eventsManager.onPointerMove.unsubscribe(this.onPointerMove)

        console.log("disable");
    }

    onPointerDown({ position }: PointerDownEventData) {
        const localPostion = this.editor.getDrawingPosition(position).clone()

        this.pressDownPosition = localPostion.clone()
        this.drawingRect = new Rect(localPostion.x, localPostion.y, 0, 0)
        this.editor.tree.addElement(this.drawingRect)
    }

    onPointerUp({ }: PointerUpEventData) {
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