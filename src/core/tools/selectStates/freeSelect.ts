import { Point } from "pixi.js";
import { SelectTool } from "../selectTool";
import { MovableSelectionState } from "./movableSelection";
import { SelectToolState } from "./abstractSelectState";
import { cursorChangeSubject } from "../../../ui/subjects";
import { DragSelectionState } from "./dragSelection";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { UpdatingSelectionAction } from "../../actions/updatingSelectionAction";
import { Editor } from "../../editor";
import { TreeBox } from "../../tree/treeBox";

export class FreeSelectState extends SelectToolState {
    constructor(selectTool: SelectTool) {
        super(selectTool)
    }

    onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point) {
        const editor = Editor.getEditor()
        const selector = editor.selectionManager;

        const localPosition = editor.positionConverter.getDrawingPosition(pointerPosition).clone()
        const topComponent = selector.getComponentsChainFromRoot(element)[0]

        editor.actionManager.push(
            new UpdatingSelectionAction(
                new SelectedComponentsModifier([topComponent])
            )
        )

        const newState = new MovableSelectionState(this.selectTool, localPosition, topComponent, true)
        this.selectTool.setState(newState)
    }

    onClickUp(element: TreeBox, shift: boolean): void { }
    onMove(newPosition: Point): void { }
    onInit() {
        cursorChangeSubject.next("default")
    }
    onDestroy() { }
    onBackgroundPointerDown(clickPosition: Point): void {
        this.selectTool.setState(new DragSelectionState(this.selectTool, clickPosition))
    }
    onBackgroundPointerUp(clickPosition: Point): void { }
}
