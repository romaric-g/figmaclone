import { Point } from "pixi.js";
import { Editor } from "../editor";
import { ElementOverOffEventData, ElementOverOnEventData, ElementPressDownEventData, ElementPressUpEventData, PointerBackgroundEventData, PointerMoveEventData } from "../eventManager";
import { Tool } from "./tool";
import { FreeSelectState } from "./selectStates/freeSelect";
import { SelectToolState } from "./selectStates/abstractSelectState";
import { TreeRect } from "../tree/treeRect";
import { TreeContainer } from "../tree/treeContainer";
import { TreeComponent } from "../tree/treeComponent";

export class SelectTool extends Tool {

    private _selectToolState: SelectToolState = new FreeSelectState(this);

    constructor(editor: Editor) {
        super(editor, "select")

        this.onBackgroundPointerDown = this.onBackgroundPointerDown.bind(this)
        this.onBackgroundPointerUp = this.onBackgroundPointerUp.bind(this)
        this.onElementPressDown = this.onElementPressDown.bind(this)
        this.onElementPressUp = this.onElementPressUp.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)

        this.onElementHoverOn = this.onElementHoverOn.bind(this)
        this.onElementHoverOff = this.onElementHoverOff.bind(this)
    }

    enable() {
        this.editor.eventsManager.onBackgroundPressDown.subscribe(this.onBackgroundPointerDown)
        this.editor.eventsManager.onBackgroundPressUp.subscribe(this.onBackgroundPointerUp)
        this.editor.eventsManager.onElementPressDown.subscribe(this.onElementPressDown)
        this.editor.eventsManager.onElementPressUp.subscribe(this.onElementPressUp)
        this.editor.eventsManager.onPointerMove.subscribe(this.onPointerMove)

        this.editor.eventsManager.onElementHoverOn.subscribe(this.onElementHoverOn)
        this.editor.eventsManager.onElementHoverOff.subscribe(this.onElementHoverOff)
    }

    disable() {
        this.editor.eventsManager.onBackgroundPressDown.unsubscribe(this.onBackgroundPointerDown)
        this.editor.eventsManager.onBackgroundPressUp.unsubscribe(this.onBackgroundPointerUp)
        this.editor.eventsManager.onElementPressDown.unsubscribe(this.onElementPressDown)
        this.editor.eventsManager.onElementPressUp.unsubscribe(this.onElementPressUp)
        this.editor.eventsManager.onPointerMove.unsubscribe(this.onPointerMove)

        this.editor.eventsManager.onElementHoverOn.unsubscribe(this.onElementHoverOn)
        this.editor.eventsManager.onElementHoverOff.unsubscribe(this.onElementHoverOff)
    }

    setState(selectToolState: SelectToolState) {
        this._selectToolState.onDestroy()
        this._selectToolState = selectToolState;

        console.log("selectToolState", selectToolState)

        this._selectToolState.onInit()
    }

    onPointerMove({ position }: PointerMoveEventData) {
        this._selectToolState.onMove(position)
    }

    onBackgroundPointerDown({ position, button }: PointerBackgroundEventData) {
        if (button === 1) {
            return;
        }

        this._selectToolState.onBackgroundPointerDown(position)
    }

    onBackgroundPointerUp({ position, button }: PointerBackgroundEventData) {
        if (button === 1) {
            return;
        }

        this._selectToolState.onBackgroundPointerUp(position)
    }

    private lastClickDown?: [Date, TreeComponent];

    onElementPressDown({ element, pointerPosition, button }: ElementPressDownEventData) {
        if (button === 1) {
            return;
        }
        const isShift = this.editor.keyboardManager.keyboardController.keys.shift.pressed;
        let isDouble = false

        const currentDate = new Date()

        if (this.lastClickDown) {
            const [lastClickDate, lastClickElement] = this.lastClickDown;

            if (lastClickElement == element) {
                const timeDiff = currentDate.valueOf() - lastClickDate.valueOf()

                console.log(timeDiff)

                if (timeDiff < 300) {
                    isDouble = true
                }
            }
        }

        this.lastClickDown = [currentDate, element]

        this._selectToolState.onClickDown(element, isShift, pointerPosition, isDouble)
    }

    onElementPressUp({ element, button }: ElementPressUpEventData) {
        if (button === 1) {
            return;
        }

        const isShift = this.editor.keyboardManager.keyboardController.keys.shift.pressed;

        this._selectToolState.onClickUp(element, isShift)
    }

    onElementHoverOn({ component }: ElementOverOnEventData) {
        const topComponent = this.editor.selectionManager.getOriginComponentsChain(component)[0]

        if (topComponent instanceof TreeRect) {
            topComponent.setHover(true)
        }
        if (topComponent instanceof TreeContainer) {
            topComponent.setHover(true)
        }
    }

    onElementHoverOff({ component }: ElementOverOffEventData) {
        const topComponent = this.editor.selectionManager.getOriginComponentsChain(component)[0]

        if (topComponent instanceof TreeRect) {
            topComponent.setHover(false)
        }
        if (topComponent instanceof TreeContainer) {
            topComponent.setHover(false)
        }
    }

    getCurrentState() {
        return this._selectToolState;
    }

    render() {
        this._selectToolState.render()
    }
}
