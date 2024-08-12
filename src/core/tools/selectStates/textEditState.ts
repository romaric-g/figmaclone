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

    private dragStartIndex?: number;

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

    getTargetLocalIndex(pointerPosition: Point) {
        const element = this._element;
        const editor = Editor.getEditor()

        const drawingPosition = editor.positionConverter.getDrawingPosition(pointerPosition)
        const localPoint = new Point(drawingPosition.x - element.x, drawingPosition.y - element.y)

        const style = this.getStyle()

        const text = this._element.text;
        const lines = TextEditUtils.getLinesFromStyle(text, style)
        const fullLines = TextEditUtils.getFullLines(text, lines)

        return TextEditUtils.getClosestIndex(fullLines, localPoint, style)
    }

    onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point, double: boolean): void {
        if (element === this._element) {
            const targetIndex = this.getTargetLocalIndex(pointerPosition);

            this.dragStartIndex = targetIndex;

            this._editIndex = targetIndex;
            this.clearSelection()
            this.startLineIndicator()
        }
    }


    onClickUp(element: TreeBox, shift: boolean, pointerPosition: Point): void {
        this.dragStartIndex = undefined;
    }

    onMove(newPosition: Point): void {
        if (this.dragStartIndex !== undefined) {
            const targetIndex = this.getTargetLocalIndex(newPosition);

            if (targetIndex !== this.dragStartIndex) {
                this.setSelection(targetIndex, this.dragStartIndex)
            }
        }
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
            }),
            new KeyboardAction("up", (type) => {
                if (type == "down") {
                    if (this._editIndex !== undefined) {

                        const style = this.getStyle()
                        const position = TextEditUtils.getIndexPointerLocalPosition(this._editIndex, this.element.text, style)

                        const newPosition = new Point(position.x, position.y - style.fontSize - 1)

                        const lines = TextEditUtils.getLinesFromStyle(this.element.text, style)
                        const fullLines = TextEditUtils.getFullLines(this.element.text, lines)
                        const newIndex = TextEditUtils.getClosestIndex(fullLines, newPosition, style)

                        this._editIndex = newIndex;
                        this.startLineIndicator()
                    }
                }
            }),
            new KeyboardAction("down", (type) => {
                if (type == "down") {
                    if (this._editIndex !== undefined) {

                        const style = this.getStyle()
                        const position = TextEditUtils.getIndexPointerLocalPosition(this._editIndex, this.element.text, style)

                        const newPosition = new Point(position.x, position.y + style.fontSize + 1)

                        const lines = TextEditUtils.getLinesFromStyle(this.element.text, style)
                        const fullLines = TextEditUtils.getFullLines(this.element.text, lines)
                        const newIndex = TextEditUtils.getClosestIndex(fullLines, newPosition, style)

                        this._editIndex = newIndex;
                        this.startLineIndicator()
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

    getStyle() {
        return TextEditUtils.getTextStyle({
            color: this._element.fillColor,
            fontSize: this._element.fontSize,
            wordWrapWidth: this._element.width
        })
    }

    clearSelection() {
        this._selectIndexs = undefined;
    }

    setSelection(index1: number, index2: number) {
        const start = Math.min(index1, index2)
        const end = Math.max(index1, index2)

        this._selectIndexs = {
            start,
            end
        }
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