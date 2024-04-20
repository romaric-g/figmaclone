import { Point } from "pixi.js";
import { Editor } from "../editor";
import { ElementPressDownEventData, ElementPressUpEventData, PointerBackgroundEventData, PointerMoveEventData } from "../eventManager";
import { Tool } from "./tool";
import { FreeSelectState } from "./selectStates/freeSelect";
import { SelectToolState } from "./selectStates/abstractSelectState";

export class SelectTool extends Tool {

    private _selectToolState: SelectToolState = new FreeSelectState(this);

    constructor(editor: Editor) {
        super(editor, "select")

        this.onBackgroundPointerDown = this.onBackgroundPointerDown.bind(this)
        this.onBackgroundPointerUp = this.onBackgroundPointerUp.bind(this)
        this.onElementPressDown = this.onElementPressDown.bind(this)
        this.onElementPressUp = this.onElementPressUp.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)
    }

    enable() {
        this.editor.eventsManager.onBackgroundPressDown.subscribe(this.onBackgroundPointerDown)
        this.editor.eventsManager.onBackgroundPressUp.subscribe(this.onBackgroundPointerUp)
        this.editor.eventsManager.onElementPressDown.subscribe(this.onElementPressDown)
        this.editor.eventsManager.onElementPressUp.subscribe(this.onElementPressUp)
        this.editor.eventsManager.onPointerMove.subscribe(this.onPointerMove)
    }

    disable() {
        this.editor.eventsManager.onBackgroundPressDown.unsubscribe(this.onBackgroundPointerDown)
        this.editor.eventsManager.onBackgroundPressUp.unsubscribe(this.onBackgroundPointerUp)
        this.editor.eventsManager.onElementPressDown.unsubscribe(this.onElementPressDown)
        this.editor.eventsManager.onElementPressUp.unsubscribe(this.onElementPressUp)
        this.editor.eventsManager.onPointerMove.unsubscribe(this.onPointerMove)
    }

    setState(selectToolState: SelectToolState) {
        this._selectToolState.onDestroy()
        this._selectToolState = selectToolState;
        this._selectToolState.onInit()
    }

    onPointerMove({ position }: PointerMoveEventData) {
        this._selectToolState.onMove(position)
    }

    onBackgroundPointerDown({ position }: PointerBackgroundEventData) {
        this._selectToolState.onBackgroundPointerDown(position)
    }

    onBackgroundPointerUp({ position }: PointerBackgroundEventData) {
        this._selectToolState.onBackgroundPointerUp(position)
    }

    onElementPressDown({ element, pointerPosition }: ElementPressDownEventData) {
        const isShift = this.editor.keyboardController.keys.shift.pressed;

        this._selectToolState.onClickDown(element, isShift, pointerPosition)
    }

    onElementPressUp({ element }: ElementPressUpEventData) {
        const isShift = this.editor.keyboardController.keys.shift.pressed;

        this._selectToolState.onClickUp(element, isShift)
    }
}
