import { Editor } from "../editor";
import { ElementOverOffEventData, ElementOverOnEventData, ElementPressDownEventData, ElementPressUpEventData, PointerBackgroundEventData, PointerMoveEventData } from "../event/eventManager";
import { Tool } from "./tool";
import { FreeSelectState } from "./selectStates/freeSelectState";
import { SelectToolState } from "./selectStates/abstractSelectState";
import { TreeRect } from "../tree/treeRect";
import { TreeContainer } from "../tree/treeContainer";
import { TreeComponent } from "../tree/treeComponent";
import { TreeBox } from "../tree/treeBox";

export class SelectTool extends Tool {

    private _selectToolState: SelectToolState = new FreeSelectState(this);

    constructor() {
        super("select")

        this.onBackgroundPointerDown = this.onBackgroundPointerDown.bind(this)
        this.onBackgroundPointerUp = this.onBackgroundPointerUp.bind(this)
        this.onElementPressDown = this.onElementPressDown.bind(this)
        this.onElementPressUp = this.onElementPressUp.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)

        this.onElementHoverOn = this.onElementHoverOn.bind(this)
        this.onElementHoverOff = this.onElementHoverOff.bind(this)
    }

    enable() {
        const editor = Editor.getEditor()
        editor.eventsManager.onBackgroundPressDown.subscribe(this.onBackgroundPointerDown)
        editor.eventsManager.onBackgroundPressUp.subscribe(this.onBackgroundPointerUp)
        editor.eventsManager.onElementPressDown.subscribe(this.onElementPressDown)
        editor.eventsManager.onElementPressUp.subscribe(this.onElementPressUp)
        editor.eventsManager.onPointerMove.subscribe(this.onPointerMove)

        editor.eventsManager.onElementHoverOn.subscribe(this.onElementHoverOn)
        editor.eventsManager.onElementHoverOff.subscribe(this.onElementHoverOff)
    }

    disable() {
        const editor = Editor.getEditor()
        editor.eventsManager.onBackgroundPressDown.unsubscribe(this.onBackgroundPointerDown)
        editor.eventsManager.onBackgroundPressUp.unsubscribe(this.onBackgroundPointerUp)
        editor.eventsManager.onElementPressDown.unsubscribe(this.onElementPressDown)
        editor.eventsManager.onElementPressUp.unsubscribe(this.onElementPressUp)
        editor.eventsManager.onPointerMove.unsubscribe(this.onPointerMove)

        editor.eventsManager.onElementHoverOn.unsubscribe(this.onElementHoverOn)
        editor.eventsManager.onElementHoverOff.unsubscribe(this.onElementHoverOff)
    }

    setState(selectToolState: SelectToolState) {
        this._selectToolState.onDestroy()
        this._selectToolState = selectToolState;
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
        const editor = Editor.getEditor()
        const isShift = editor.keyboardManager.keyboardController.keys.shift.pressed;
        let isDouble = false

        const currentDate = new Date()

        if (this.lastClickDown) {
            const [lastClickDate, lastClickElement] = this.lastClickDown;

            if (lastClickElement == element) {
                const timeDiff = currentDate.valueOf() - lastClickDate.valueOf()

                if (timeDiff < 450) {
                    isDouble = true
                }
            }
        }

        this.lastClickDown = [currentDate, element]

        this._selectToolState.onClickDown(element, isShift, pointerPosition, isDouble)
    }

    onElementPressUp({ element, pointerPosition, button }: ElementPressUpEventData) {
        if (button === 1) {
            return;
        }
        const editor = Editor.getEditor()
        const isShift = editor.keyboardManager.keyboardController.keys.shift.pressed;

        this._selectToolState.onClickUp(element, isShift, pointerPosition)
    }

    onElementHoverOn({ component }: ElementOverOnEventData) {

        const editor = Editor.getEditor()

        const topComponent = editor.selectionManager.getComponentsChainFromRoot(component)[0]

        if (topComponent instanceof TreeBox) {
            topComponent.setHover(true)
        }
        if (topComponent instanceof TreeContainer) {
            topComponent.setHover(true)
        }
    }

    onElementHoverOff({ component }: ElementOverOffEventData) {
        const editor = Editor.getEditor()
        const topComponent = editor.selectionManager.getComponentsChainFromRoot(component)[0]

        if (topComponent instanceof TreeBox) {
            topComponent.setHover(false)
        }
        if (topComponent instanceof TreeContainer) {
            topComponent.setHover(false)
        }
    }

    getCurrentState() {
        return this._selectToolState;
    }
}
