import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { SelectionState } from "./selection";
import { SelectToolState } from "./abstractSelectState";
import { TreeComponent } from "../../tree/treeComponent";
import { StickyLineRenderer } from "../../canvas/renderer/stickyLine";
import { UpdateSelectionPropertiesAction } from "../../actions/updateSelectionPropertiesAction";
import { UpdateSelectionAction } from "../../actions/updateSelectionAction";

export class MovableSelectionState extends SelectToolState {
    private _sourceClickedPosition: Point;
    private _componentAddedBefore: boolean;
    private _moveComponent: TreeComponent;
    private _haveMove: boolean = false;

    private _stickyX?: number;
    private _stickyY?: number;

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
        const editor = this.selectTool.editor;

        editor.selectionManager.getSelection().freezeMoveOrigin()
        this.stickyLineRenderer.init(editor.canvasApp.getSelectionLayer())
    }

    onDestroy() {
        const editor = this.selectTool.editor;

        editor.selectionManager.getSelection().unfreezeMoveOrigin()
        this.stickyLineRenderer.destroy(editor.canvasApp.getSelectionLayer())
    }

    onClickUp(element: TreeRect, shift: boolean) {
        const editor = this.selectTool.editor
        const selectionManager = editor.selectionManager;
        const selectionBuilder = selectionManager.getSelection().getBuilder(editor)

        if (!this.haveMoov()) {
            if (shift) {
                // Si l'element n'a pas été ajouté lors du click down source
                if (!this._componentAddedBefore) {
                    editor.actionManager.push(
                        new UpdateSelectionAction(
                            selectionBuilder.remove(this._moveComponent).build()
                        )
                    )
                }
            } else {
                editor.actionManager.push(
                    new UpdateSelectionAction(
                        selectionBuilder.set(this._moveComponent).build()
                    )
                )
            }
        }

        this.selectTool.setState(new SelectionState(this.selectTool))
    }

    onMove(newPosition: Point): void {
        const localPostion = this.selectTool.editor.getDrawingPosition(newPosition).clone()
        const movementVector = this.getMouvementVector(localPostion)
        const selection = this.selectTool.editor.selectionManager.getSelection()

        const {
            vector,
            stickyX,
            stickyY
        } = selection.getStickyMoveVector(movementVector)

        this._stickyX = stickyX;
        this._stickyY = stickyY;

        this.selectTool.editor.actionManager.push(
            new UpdateSelectionPropertiesAction(selection, (selection) => {
                selection.move(vector)
            })
        )

        if (!this._haveMove) {
            this._haveMove = true;
        }
    }

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point): void { }
    onBackgroundPointerDown(clickPosition: Point): void { }
    onBackgroundPointerUp(clickPosition: Point): void { }

    render() {
        this.stickyLineRenderer.render()
    }

    getStickyInfo() {
        return {
            x: this._stickyX,
            y: this._stickyY
        }
    }

    haveMove() {
        return this._haveMove;
    }
}