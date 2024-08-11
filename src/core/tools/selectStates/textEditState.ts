import { Point } from "pixi.js";
import { TreeBox } from "../../tree/treeBox";
import { SelectToolState } from "./abstractSelectState";
import { SelectTool } from "../selectTool";
import { TreeText } from "../../tree/treeText";
import { Editor } from "../../editor";
import { KeyboardAttach } from "../../keyboard/keyboardAttach";
import { FreeSelectState } from "./freeSelectState";
import { ClearSelection } from "../../actions/clearSelection";
import { KeyboardAction } from "../../keyboard/keyboardAction";
import { TextEditUtils } from "../../utils/textEditUtils";


export class TextEditState extends SelectToolState {


    private _element: TreeText;

    private _editIndex: number = 0;
    private _selectIndexs: { start: number, end: number } | undefined;

    private _lineIndicatorIsShow = true;
    private indicatorIntervalId: NodeJS.Timeout | null = null;

    private prevAttach?: KeyboardAttach;

    constructor(selectTool: SelectTool, treeText: TreeText) {
        super(selectTool)
        this._element = treeText;
    }

    getTextComponent() {
        return this._element;
    }


    onInit(): void {
        this.attachKeyboardEvents()
    }

    onDestroy(): void {
        this.detachKeyboardEvents()
    }

    onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point, double: boolean): void {

        if (element === this._element) {
            console.log("pointerPosition", pointerPosition)

            const editor = Editor.getEditor()

            const drawingPosition = editor.positionConverter.getDrawingPosition(pointerPosition)
            const localPoint = new Point(drawingPosition.x - element.x, drawingPosition.y - element.y)

            const style = TextEditUtils.getTextStyle({
                color: this.element.fillColor,
                fontSize: this.element.fontSize,
                wordWrapWidth: this.element.width
            })
            const lineIndex = TextEditUtils.getClosestLineIndex(this._element.text, localPoint.y, style)

            console.log("lineIndex", lineIndex)
        }
    }




    onClickUp(element: TreeBox, shift: boolean): void {
    }
    onMove(newPosition: Point): void {
    }
    onBackgroundPointerDown(clickPosition: Point): void {
        this.exit()
    }
    onBackgroundPointerUp(clickPosition: Point): void {
    }

    exit() {
        if (this._element.text === "") {
            this._element.destroy()
        }

        Editor.getEditor().actionManager.push(
            new ClearSelection()
        )

        this.selectTool.setState(new FreeSelectState(this.selectTool))
    }

    attachKeyboardEvents() {
        const keyAttach = new KeyboardAttach()

        this._editIndex = this._element.text.length
        this.prevAttach = Editor.getEditor().keyboardManager.getAttach()


        keyAttach.addActions(
            new KeyboardAction("a", (type) => {
                if (type == "down") {
                    const controlPressed = Editor.getEditor().keyboardManager.keyboardController.keys.control.pressed;
                    if (controlPressed) {
                        this.selectAll()
                    }
                }
            }),
            new KeyboardAction("right", (type) => {
                if (this.selectedIndexs) {
                    this._editIndex = this.selectedIndexs.end;
                    this.startLineIndicator()
                    this.clearSelection()
                } else if (this._editIndex < this.getMaxIndex() && type == "down") {
                    this.startLineIndicator()
                    this._editIndex++;
                }
            }),
            new KeyboardAction("left", (type) => {
                if (this.selectedIndexs) {
                    this._editIndex = this.selectedIndexs.start;
                    this.startLineIndicator()
                    this.clearSelection()
                } else if (this._editIndex > 0 && type == "down") {
                    this.startLineIndicator()
                    this._editIndex--;
                }
            }),
            new KeyboardAction("backspace", (type) => {
                if (type == "down") {
                    let prevText = this._element.text;
                    if (this.selectedIndexs) {
                        this._element.text = prevText.slice(0, this.selectedIndexs.start) + prevText.slice(this.selectedIndexs.end);
                        this._editIndex = this.selectedIndexs.start;
                        this.clearSelection()
                    } else if (this._editIndex > 0) {
                        this.startLineIndicator()
                        this._element.text = prevText.slice(0, this._editIndex - 1) + prevText.slice(this._editIndex);
                        this._editIndex--;
                    }
                }
            })
        )

        keyAttach.addListener((event: KeyboardEvent, type: "up" | "down") => {
            if (type === "down") {
                const controlPressed = Editor.getEditor().keyboardManager.keyboardController.keys.control.pressed;

                if (controlPressed) {
                    return;
                }

                let newChar = "";
                if (event.key === "Enter") {
                    newChar = "\n";
                } else if (event.key.length === 1) {
                    newChar = event.key;
                }

                let newText = this._element.text;
                if (newChar) {
                    if (this.selectedIndexs) {
                        newText = newText.slice(0, this.selectedIndexs.start) + newChar + newText.slice(this.selectedIndexs.end);
                        this._editIndex = this.selectedIndexs.start + 1;
                    } else {
                        if (newText.length >= this._editIndex) {
                            newText = newText.slice(0, this._editIndex) + newChar + newText.slice(this._editIndex);
                        } else {
                            newText += newChar;
                        }
                        this._editIndex += 1;
                    }
                    this._element.text = newText;
                    this.clearSelection()
                    this.startLineIndicator()
                }
            }
        })

        Editor.getEditor().keyboardManager.setAttach(keyAttach)
    }

    clearSelection() {
        this._selectIndexs = undefined;
    }

    detachKeyboardEvents() {
        if (this.prevAttach) {
            Editor.getEditor().keyboardManager.setAttach(this.prevAttach)
            this.prevAttach = undefined;
        }
    }

    stopLineIndicator() {
        if (this.indicatorIntervalId != null) {
            clearInterval(this.indicatorIntervalId);
            this.indicatorIntervalId = null;
        }
    }

    startLineIndicator() {
        this.stopLineIndicator()

        this._lineIndicatorIsShow = true;

        this.indicatorIntervalId = setInterval(() => {
            this._lineIndicatorIsShow = !this._lineIndicatorIsShow;
        }, 500);
    }

    getMaxIndex() {
        return this._element.text.length;
    }

    selectAll() {
        this._selectIndexs = {
            start: 0,
            end: this._element.text.length
        }
    }

    get element() {
        return this._element;
    }

    get lineIndicatorIsShow() {
        return this._lineIndicatorIsShow
    }

    get editIndex() {
        return this._editIndex;
    }

    get selectedIndexs() {
        return this._selectIndexs;
    }

}