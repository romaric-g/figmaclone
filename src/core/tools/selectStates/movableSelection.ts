import { Point } from "pixi.js";
import { Element } from "../../element";
import { SelectTool } from "../selectTool";
import { SelectionState } from "./selection";
import { SelectToolState } from "./abstractSelectState";
import { Editor } from "../../editor";

export class MovableSelectionState extends SelectToolState {
    private _sourceClickedPosition: Point;
    private _clickedElement: Element;
    private _clickedElementAddedOnClickDownSource: boolean;

    constructor(selectTool: SelectTool, sourceClickedPostion: Point, clickElement: Element, clickedElementAddedOnClickDownSource: boolean) {
        super(selectTool)
        this._sourceClickedPosition = sourceClickedPostion.clone();
        this._clickedElement = clickElement;
        this._clickedElementAddedOnClickDownSource = clickedElementAddedOnClickDownSource;
    }

    private getMouvementVector(currentPointerPosition: Point) {
        const x = currentPointerPosition.x - this._sourceClickedPosition.x;
        const y = currentPointerPosition.y - this._sourceClickedPosition.y;

        return new Point(x, y)
    }

    private haveMoov() {
        const referenceElement = this._clickedElement

        const sameX = referenceElement.x == referenceElement.getOriginalPosition().x
        const sameY = referenceElement.y == referenceElement.getOriginalPosition().y

        if (sameX && sameY) {
            return false;
        } else {
            return true;
        }
    }

    onInit() {
        this.selectTool.editor.selector.getSelection().freezeMoveOrigin()
    }

    onDestroy() {
        this.selectTool.editor.selector.getSelection().unfreezeMoveOrigin()
    }

    onClickUp(element: Element, shift: boolean) {
        const editor = this.selectTool.editor
        const selector = editor.selector;
        const selectionBuilder = selector.getSelection().getBuilder(editor)

        if (!this.haveMoov()) {
            if (shift) {
                // Si l'element n'a pas été ajouté lors du click down source
                if (!this._clickedElementAddedOnClickDownSource) {
                    selectionBuilder.remove(this._clickedElement).apply(selector)
                }
            } else {
                selectionBuilder.set(this._clickedElement).apply(selector)
            }
        }

        this.selectTool.setState(new SelectionState(this.selectTool))
    }

    onMove(newPosition: Point): void {
        const localPostion = this.selectTool.editor.getDrawingPosition(newPosition).clone()

        const movementVector = this.getMouvementVector(localPostion)

        this.selectTool.editor.selector.getSelection().move(movementVector)
    }

    onClickDown(element: Element, shift: boolean, pointerPosition: Point): void { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void { }

}