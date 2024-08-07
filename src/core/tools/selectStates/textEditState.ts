import { Point } from "pixi.js";
import { TreeBox } from "../../tree/treeBox";
import { SelectToolState } from "./abstractSelectState";
import { SelectTool } from "../selectTool";
import { TreeText } from "../../tree/treeText";
import { Editor } from "../../editor";
import { KeyboardAttach } from "../../keyboard/keyboardAttach";
import { FreeSelectState } from "./freeSelect";
import { MovableSelectionState } from "./movableSelection";
import { UpdatingSelectionAction } from "../../actions/updatingSelectionAction";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { ClearSelection } from "../../actions/clearSelection";


export class TextEditState extends SelectToolState {

    private treeText: TreeText;
    private editIndex: number = 0;
    private prevAttach?: KeyboardAttach;


    constructor(selectTool: SelectTool, treeText: TreeText) {
        super(selectTool)
        this.treeText = treeText;
    }

    getTextComponent() {
        return this.treeText;
    }


    onInit(): void {
    }

    onDestroy(): void {
    }
    onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point, double: boolean): void {
        const editor = Editor.getEditor()
        const localPosition = editor.positionConverter.getDrawingPosition(pointerPosition).clone()

        const newState = new MovableSelectionState(this.selectTool, localPosition, element, true)

        editor.actionManager.push(
            new UpdatingSelectionAction(
                new SelectedComponentsModifier([element])
            )
        )

        this.selectTool.setState(newState)
    }
    onClickUp(element: TreeBox, shift: boolean): void {
    }
    onMove(newPosition: Point): void {
    }
    onBackgroundPointerDown(clickPosition: Point): void {

        Editor.getEditor().actionManager.push(
            new ClearSelection()
        )

        this.selectTool.setState(new FreeSelectState(this.selectTool))
    }
    onBackgroundPointerUp(clickPosition: Point): void {
    }
}