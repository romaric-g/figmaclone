import { Point } from "pixi.js";
import { SelectTool } from "../selectTool";
import { SelectionState } from "./selectionState";
import { SelectToolState } from "./abstractSelectState";
import { TreeComponent } from "../../tree/treeComponent";
import { UpdateSelectionPropertiesAction } from "../../actions/updateSelectionPropertiesAction";
import { Editor } from "../../editor";
import { ClearSelection } from "../../actions/clearSelection";
import { FreeSelectState } from "./freeSelectState";
import { SetSelectionAction } from "../../actions/setSelectionAction";
import { SetSelectionPropertiesAction } from "../../actions/setSelectionPropertiesAction";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { getSquaredCoveredZone } from "../../utils/squaredZone";
import { findMinimumDifference } from "../../utils/findMinimumDifference";
import { TreeBox } from "../../tree/treeBox";

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
        const editor = Editor.getEditor()

        editor.selectionManager.getSelectionModifier().freezeMoveOrigin()
    }

    onDestroy() {
        const editor = Editor.getEditor()

        editor.selectionManager.getSelectionModifier().unfreezeMoveOrigin()
    }

    onClickUp(element: TreeBox, shift: boolean) {
        const editor = Editor.getEditor()
        const selectionManager = editor.selectionManager;
        const selectionBuilder = selectionManager.getSelectionModifier().getBuilder(editor)

        if (!this.haveMoov()) {
            if (shift) {
                // Si l'element n'a pas été ajouté lors du click down source
                if (!this._componentAddedBefore) {
                    editor.actionManager.push(
                        new SetSelectionAction(
                            selectionBuilder.remove(this._moveComponent).build()
                        )
                    )
                }
            } else {
                editor.actionManager.push(
                    new SetSelectionAction(
                        selectionBuilder.set(this._moveComponent).build()
                    )
                )
            }
        } else {
            editor.actionManager.push(
                new SetSelectionPropertiesAction(Editor.getEditor().selectionManager.getSelectionModifier())
            )
        }

        this.selectTool.setState(new SelectionState(this.selectTool))
    }

    onMove(newPosition: Point): void {
        const editor = Editor.getEditor()

        const localPostion = editor.positionConverter.getDrawingPosition(newPosition).clone()
        const movementVector = this.getMouvementVector(localPostion)
        const selection = editor.selectionManager.getSelectionModifier()

        const vector = this.getStickyMoveVector(selection, movementVector)

        editor.actionManager.push(
            new UpdateSelectionPropertiesAction(selection, (selection) => {
                selection.move(vector)
            })
        )

        if (!this._haveMove) {
            this._haveMove = true;
        }
    }

    getStickyMoveVector(selection: SelectedComponentsModifier, moveVector: Point): Point {
        const editor = Editor.getEditor()

        const selectionRects = selection.getAllBoxComponents()
        const squaredZones = selectionRects.map(r => r.getSquaredZoneFromOrigin())
        const squaredZone = getSquaredCoveredZone(squaredZones)

        if (!squaredZone) {
            return moveVector;
        }

        const boxs = editor.treeManager.getAllBoxComponents().filter((r) => !selectionRects.includes(r))

        if (boxs.length === 0) {
            return moveVector;
        }

        squaredZone.minX += moveVector.x;
        squaredZone.maxX += moveVector.x;
        squaredZone.minY += moveVector.y;
        squaredZone.maxY += moveVector.y;

        const xs = boxs.map((r) => [r.x, r.x + r.width]).flat()
        const ys = boxs.map((r) => [r.y, r.y + r.height]).flat()

        const [x, sel_x, min_diff_x] = findMinimumDifference(xs, [squaredZone.minX, squaredZone.maxX]);
        const [y, sel_y, min_diff_y] = findMinimumDifference(ys, [squaredZone.minY, squaredZone.maxY]);

        const newMoveVector = moveVector.clone()

        if (min_diff_x < 10) {
            newMoveVector.x = x - (sel_x - moveVector.x)
        }

        if (min_diff_y < 10) {
            newMoveVector.y = y - (sel_y - moveVector.y)
        }

        return newMoveVector;
    }

    onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point): void { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void {

        if (this.haveMoov()) {
            const editor = Editor.getEditor()
            editor.actionManager.push(
                new SetSelectionPropertiesAction(Editor.getEditor().selectionManager.getSelectionModifier())
            )

            this.selectTool.setState(new SelectionState(this.selectTool))
        } else {
            Editor.getEditor().actionManager.push(
                new ClearSelection()
            )

            this.selectTool.setState(new FreeSelectState(this.selectTool))
        }

    }

    haveMove() {
        return this._haveMove;
    }
}