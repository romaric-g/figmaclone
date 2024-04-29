import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { SelectionState } from "./selection";
import { SelectToolState } from "./abstractSelectState";
import { TreeComponent } from "../../tree/treeComponent";

export class MovableSelectionState extends SelectToolState {
    private _sourceClickedPosition: Point;
    private _componentAddedBefore: boolean;
    private _moveComponent: TreeComponent;
    private _haveMove: boolean = false;

    constructor(selectTool: SelectTool, sourceClickedPostion: Point, moveComponent: TreeComponent, componentAddedBefore: boolean) {
        super(selectTool)
        this._sourceClickedPosition = sourceClickedPostion.clone();
        this._moveComponent = moveComponent;
        this._componentAddedBefore = componentAddedBefore;
    }

    private getMouvementVector(currentPointerPosition: Point) {
        const x = currentPointerPosition.x - this._sourceClickedPosition.x;
        const y = currentPointerPosition.y - this._sourceClickedPosition.y;

        return new Point(x, y)
    }

    private haveMoov() {
        return this._haveMove;
    }

    onInit() {
        this.selectTool.editor.selectionManager.getSelection().freezeMoveOrigin()
    }

    onDestroy() {
        this.selectTool.editor.selectionManager.getSelection().unfreezeMoveOrigin()
    }

    onClickUp(element: TreeRect, shift: boolean) {
        const editor = this.selectTool.editor
        const selector = editor.selectionManager;
        const selectionBuilder = selector.getSelection().getBuilder(editor)

        if (!this.haveMoov()) {
            if (shift) {
                // Si l'element n'a pas été ajouté lors du click down source
                if (!this._componentAddedBefore) {
                    selectionBuilder.remove(this._moveComponent).apply(selector)
                }
            } else {
                selectionBuilder.set(this._moveComponent).apply(selector)
            }
        }

        this.selectTool.setState(new SelectionState(this.selectTool))
    }

    onMove(newPosition: Point): void {
        const localPostion = this.selectTool.editor.getDrawingPosition(newPosition).clone()
        const movementVector = this.getMouvementVector(localPostion)

        this.selectTool.editor.selectionManager.getSelection().move(movementVector)

        if (!this._haveMove) {
            this._haveMove = true;
        }
    }

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point): void { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void { }

}