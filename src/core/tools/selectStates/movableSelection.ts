import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { SelectionState } from "./selection";
import { SelectToolState } from "./abstractSelectState";
import { TreeComponent } from "../../tree/treeComponent";
import { StickyLineRenderer } from "../../canvas/renderer/stickyLine";
import { UpdateSelectionPropertiesAction } from "../../actions/updateSelectionPropertiesAction";
import { Editor } from "../../editor";
import { ClearSelection } from "../../actions/clearSelection";
import { FreeSelectState } from "./freeSelect";
import { SetSelectionAction } from "../../actions/setSelectionAction";
import { SetSelectionPropertiesAction } from "../../actions/setSelectionPropertiesAction";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { getSquaredCoveredZone } from "../../utils/squaredZone";
import { findMinimumDifference } from "../../utils/findMinimumDifference";

export class MovableSelectionState extends SelectToolState {
    private _sourceClickedPosition: Point;
    private _componentAddedBefore: boolean;
    private _moveComponent: TreeComponent;
    private _haveMove: boolean = false;


    private stickyLineRenderer: StickyLineRenderer;

    constructor(selectTool: SelectTool, sourceClickedPostion: Point, moveComponent: TreeComponent, componentAddedBefore: boolean) {
        super(selectTool)
        this._sourceClickedPosition = sourceClickedPostion.clone();
        this._moveComponent = moveComponent;
        this._componentAddedBefore = componentAddedBefore;
        this.stickyLineRenderer = new StickyLineRenderer(this)
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

        editor.selectionManager.getSelection().freezeMoveOrigin()
        this.stickyLineRenderer.init(editor.canvasApp.getSelectionLayer())
    }

    onDestroy() {
        const editor = Editor.getEditor()

        editor.selectionManager.getSelection().unfreezeMoveOrigin()
        this.stickyLineRenderer.destroy(editor.canvasApp.getSelectionLayer())
    }

    onClickUp(element: TreeRect, shift: boolean) {
        const editor = Editor.getEditor()
        const selectionManager = editor.selectionManager;
        const selectionBuilder = selectionManager.getSelection().getBuilder(editor)

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
                new SetSelectionPropertiesAction(Editor.getEditor().selectionManager.getSelection())
            )
        }

        this.selectTool.setState(new SelectionState(this.selectTool))
    }

    onMove(newPosition: Point): void {
        const editor = Editor.getEditor()

        const localPostion = editor.getDrawingPosition(newPosition).clone()
        const movementVector = this.getMouvementVector(localPostion)
        const selection = editor.selectionManager.getSelection()

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

        const selectionRects = selection.getAllRectComponents()
        const squaredZones = selectionRects.map(r => r.getSquaredZoneFromOrigin())
        const squaredZone = getSquaredCoveredZone(squaredZones)

        if (!squaredZone) {
            return moveVector;
        }

        const rects = editor.treeManager.getAllRectComponents().filter((r) => !selectionRects.includes(r))

        if (rects.length === 0) {
            return moveVector;
        }

        squaredZone.minX += moveVector.x;
        squaredZone.maxX += moveVector.x;
        squaredZone.minY += moveVector.y;
        squaredZone.maxY += moveVector.y;

        const xs = rects.map((r) => [r.x, r.x + r.width]).flat()
        const ys = rects.map((r) => [r.y, r.y + r.height]).flat()

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

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point): void { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void {

        if (this.haveMoov()) {
            const editor = Editor.getEditor()
            editor.actionManager.push(
                new SetSelectionPropertiesAction(Editor.getEditor().selectionManager.getSelection())
            )

            this.selectTool.setState(new SelectionState(this.selectTool))
        } else {
            Editor.getEditor().actionManager.push(
                new ClearSelection()
            )

            this.selectTool.setState(new FreeSelectState(this.selectTool))
        }

    }

    render() {
        this.stickyLineRenderer.render()
    }



    haveMove() {
        return this._haveMove;
    }
}