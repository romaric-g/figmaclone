import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { MovableSelectionState } from "./movableSelection";
import { SelectToolState } from "./abstractSelectState";
import { cursorChangeSubject } from "../../../ui/subjects";

export class FreeSelectState extends SelectToolState {
    constructor(selectTool: SelectTool) {
        super(selectTool)
    }

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point) {
        const editor = this.selectTool.editor
        const selector = editor.selector;

        const localPosition = editor.getDrawingPosition(pointerPosition).clone()
        const topComponent = selector.getInnerTopComponent(element)

        const selectionBuilder = selector.getSelection().getBuilder(editor)

        selectionBuilder.set(element).apply(selector)

        const newState = new MovableSelectionState(this.selectTool, localPosition, element, true)
        this.selectTool.setState(newState)
    }

    onClickUp(element: TreeRect, shift: boolean): void { }
    onMove(newPosition: Point): void { }
    onInit() {
        cursorChangeSubject.next("default")
    }
    onDestroy() { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void { }

}
