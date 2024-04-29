import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { MovableSelectionState } from "./movableSelection";
import { SelectToolState } from "./abstractSelectState";
import { cursorChangeSubject } from "../../../ui/subjects";
import { getCursorType, ReshapeReference, ReshapeSelectState } from "./reshapeSelect";
import { FreeSelectState } from "./freeSelect";
import { TreeContainer } from "../../tree/treeContainer";
import { DragSelectionState } from "./dragSelection";

export class SelectionState extends SelectToolState {

    private _singleElement?: TreeRect;
    private _reshapeReference: ReshapeReference = "none";

    constructor(selectTool: SelectTool) {
        super(selectTool)
    }

    private updateReshapeReference(localPostion: Point) {
        const [threasholdX, threasholdY] = this.selectTool.editor.getDrawingSize(16, 16);

        if (this._singleElement) {

            let inMinXRange = (this._singleElement.x - threasholdX) < localPostion.x
            let inMinYRange = (this._singleElement.y - threasholdY) < localPostion.y
            let inMaxXRange = (this._singleElement.x + this._singleElement.width + threasholdX) > localPostion.x
            let inMaxYRange = (this._singleElement.y + this._singleElement.height + threasholdY) > localPostion.y

            if (inMinXRange && inMinYRange && inMaxXRange && inMaxYRange) {

                let inXStartRange = Math.abs(this._singleElement.x - localPostion.x) < threasholdX
                let inYStartRange = Math.abs(this._singleElement.y - localPostion.y) < threasholdY

                let inXEndRange = Math.abs((this._singleElement.x + this._singleElement.width) - localPostion.x) < threasholdX
                let inYEndRange = Math.abs((this._singleElement.y + this._singleElement.height) - localPostion.y) < threasholdY

                let inXRange = inXStartRange || inXEndRange
                let inYRange = inYStartRange || inYEndRange

                if ((inXRange || inYRange)) {
                    let newRef: ReshapeReference = "none"

                    if (inXStartRange && inYStartRange) {
                        newRef = "top-left"
                    } else if (inXStartRange && inYEndRange) {
                        newRef = "bottom-left"
                    } else if (inXEndRange && inYStartRange) {
                        newRef = "top-right"
                    } else if (inXEndRange && inYEndRange) {
                        newRef = "bottom-right"
                    } else if (inXStartRange) {
                        newRef = "left"
                    } else if (inXEndRange) {
                        newRef = "right"
                    } else if (inYStartRange) {
                        newRef = "top"
                    } else if (inYEndRange) {
                        newRef = "bottom"
                    }

                    if (newRef !== this._reshapeReference) {
                        this._reshapeReference = newRef
                        cursorChangeSubject.next(getCursorType(this._reshapeReference))
                    }

                    return;
                }
            }

            if (this._reshapeReference !== "none") {
                this._reshapeReference = "none"
                cursorChangeSubject.next(getCursorType(this._reshapeReference))
            }

        }
    }

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point, isDouble: boolean) {

        console.log("IS DOUBLE", isDouble)

        const editor = this.selectTool.editor
        const selector = editor.selectionManager;

        const localPostion = editor.getDrawingPosition(pointerPosition).clone()

        const topComponentChain = selector.getOriginComponentsChain(element)

        const chainIdx = isDouble && topComponentChain.length > 1 ? 1 : 0
        const topComponent = topComponentChain[chainIdx]

        if (topComponent instanceof TreeContainer || topComponent instanceof TreeRect) {
            const selectionBuilder = selector.getSelection().getBuilder(editor)

            this.updateReshapeReference(localPostion)

            if (this._reshapeReference === "none") {
                if (topComponent.isSelected()) {
                    console.log("SELECTED")
                    const newState = new MovableSelectionState(this.selectTool, localPostion, topComponent, false)
                    this.selectTool.setState(newState)
                } else {
                    const newState = new MovableSelectionState(this.selectTool, localPostion, topComponent, true)

                    if (shift) {
                        console.log("SELECT WITH ADD")
                        selectionBuilder.add(topComponent).apply(selector)
                    } else {
                        console.log("SELECT WITH SET")
                        selectionBuilder.set(topComponent).apply(selector)
                    }

                    this.selectTool.setState(newState)
                }
            } else if (this._singleElement) {
                const newState = new ReshapeSelectState(this.selectTool, this._singleElement, this._reshapeReference, localPostion);
                this.selectTool.setState(newState)
            }
        }
    }

    onBackgroundPointerDown(clickPosition: Point): void {
        const localPosition = this.selectTool.editor.getDrawingPosition(clickPosition).clone()

        this.updateReshapeReference(localPosition)

        if (this._singleElement && this._reshapeReference !== "none") {
            const newState = new ReshapeSelectState(this.selectTool, this._singleElement, this._reshapeReference, localPosition);
            this.selectTool.setState(newState)

        } else if (!this.selectTool.editor.keyboardController.keys.shift.pressed) {
            this.selectTool.editor.selectionManager.unselectAll()
            this.selectTool.setState(new DragSelectionState(this.selectTool, clickPosition))
        }

    }

    onMove(newPosition: Point): void {
        const localPostion = this.selectTool.editor.getDrawingPosition(newPosition).clone()

        this.updateReshapeReference(localPostion)
    }

    onInit() {
        const elements = this.selectTool.editor.selectionManager.getSelection().getFlatComponents()

        if (elements.length === 1 && elements[0] instanceof TreeRect) {
            this._singleElement = elements[0]
        }
    }

    onClickUp(element: TreeRect, shift: boolean): void { }
    onDestroy() { }
    onBackgroundPointerUp(clickPosition: Point): void { }
}
