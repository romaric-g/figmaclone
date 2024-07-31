import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { MovableSelectionState } from "./movableSelection";
import { SelectToolState } from "./abstractSelectState";
import { cursorChangeSubject } from "../../../ui/subjects";
import { DragSelectionState } from "./dragSelection";
import { Selection } from "../../selections/selection";
import { UpdatingSelectionAction } from "../../actions/updatingSelectionAction";
import { Editor } from "../../editor";

export class FreeSelectState extends SelectToolState {
    constructor(selectTool: SelectTool) {
        super(selectTool)
    }

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point) {
        const editor = Editor.getEditor()
        const selector = editor.selectionManager;

        const localPosition = editor.getDrawingPosition(pointerPosition).clone()
        const topComponent = selector.getComponentsChainFromRoot(element)[0]

        editor.actionManager.push(
            new UpdatingSelectionAction(
                new Selection([topComponent])
            )
        )

        const newState = new MovableSelectionState(this.selectTool, localPosition, topComponent, true)
        this.selectTool.setState(newState)
    }

    onClickUp(element: TreeRect, shift: boolean): void { }
    onMove(newPosition: Point): void { }
    onInit() {
        cursorChangeSubject.next("default")
    }
    onDestroy() { }
    onBackgroundPointerDown(clickPosition: Point): void {
        this.selectTool.setState(new DragSelectionState(this.selectTool, clickPosition))
    }
    onBackgroundPointerUp(clickPosition: Point): void { }
    render() { }

}
