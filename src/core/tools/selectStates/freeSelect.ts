import { Point } from "pixi.js";
import { Element } from "../../element";
import { SelectTool } from "../selectTool";
import { MovableSelectionState } from "./movableSelection";
import { SelectToolState } from "./abstractSelectState";
import { cursorChangeSubject } from "../../../ui/subjects";

export class FreeSelectState extends SelectToolState {
    constructor(selectTool: SelectTool) {
        super(selectTool)
    }

    onClickDown(element: Element, shift: boolean, pointerPosition: Point) {
        const localPosition = this.selectTool.editor.getDrawingPosition(pointerPosition).clone()

        const editor = this.selectTool.editor
        const selector = editor.selector;
        const selectionBuilder = selector.getSelection().getBuilder(editor)

        selectionBuilder.set(element).apply(selector)

        const newState = new MovableSelectionState(this.selectTool, localPosition, element, true)
        this.selectTool.setState(newState)
    }

    onClickUp(element: Element, shift: boolean): void { }
    onMove(newPosition: Point): void { }
    onInit() {
        cursorChangeSubject.next("default")
    }
    onDestroy() { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void { }

}
