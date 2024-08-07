import { Point } from "pixi.js";
import { TreeRect } from "../../tree/treeRect";
import { SelectTool } from "../selectTool";
import { SelectToolState } from "./abstractSelectState";
import { FreeSelectState } from "./freeSelect";
import { DragSelectionBoxRenderer } from "../../canvas/renderer/dragSelectorBox";
import { Editor } from "../../editor";
import { TreeComponent } from "../../tree/treeComponent";
import { Selection } from "../../selections/selection";
import { SelectionState } from "./selection";
import { UpdatingSelectionAction } from "../../actions/updatingSelectionAction";
import { SetSelectionAction } from "../../actions/setSelectionAction";

// Quand l'utilisateur presse le bouton gauche de sa souris et alors peut bouger 
// sa souris pour selectionner un ensemble d'elements
export class DragSelectionState extends SelectToolState {

    private _renderer: DragSelectionBoxRenderer;
    private _sourceClickedPosition: Point;
    private _lastDragPosition?: Point;

    constructor(selectTool: SelectTool, sourceClickedPosition: Point) {
        super(selectTool)
        this._renderer = new DragSelectionBoxRenderer(this)
        this._sourceClickedPosition = sourceClickedPosition.clone()
    }

    getFromClickedPosition() {
        return this._sourceClickedPosition;
    }

    getDragPosition() {
        return this._lastDragPosition;
    }

    getCoveredRect() {

        const fromPoint = this.getFromClickedPosition()
        const toPoint = this.getDragPosition()

        if (!toPoint) {
            return undefined;
        }

        return {
            minX: Math.min(fromPoint.x, toPoint.x),
            minY: Math.min(fromPoint.y, toPoint.y),
            maxX: Math.max(fromPoint.x, toPoint.x),
            maxY: Math.max(fromPoint.y, toPoint.y)
        }
    }

    onMove(newPosition: Point): void {
        const editor = Editor.getEditor()

        this._lastDragPosition = newPosition.clone()

        const selectionCoveredRect = this.getCoveredRect()

        if (!selectionCoveredRect) {
            return
        }


        const toSelectComponents: TreeComponent[] = []

        const rootComponents = editor.treeManager.getTree().getComponents()

        for (const rootComponent of rootComponents) {
            const componentCoveredRect = rootComponent.getCanvasCoveredRect()
            if (componentCoveredRect) {

                const isLeft = componentCoveredRect.maxX < selectionCoveredRect.minX;
                const isRight = componentCoveredRect.minX > selectionCoveredRect.maxX;
                const isAbove = componentCoveredRect.maxY < selectionCoveredRect.minY;
                const isBelow = componentCoveredRect.minY > selectionCoveredRect.maxY;

                if (!isLeft && !isRight && !isAbove && !isBelow) {
                    toSelectComponents.push(rootComponent)
                }
            }
        }

        editor.actionManager.push(
            new UpdatingSelectionAction(new Selection(toSelectComponents))
        )
    }

    onInit(): void {
        this._renderer.init()
    }

    onDestroy(): void {
        this._renderer.destroy()
    }

    onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point, double: boolean): void { }

    onClickUp(element: TreeRect, shift: boolean): void {
        this.exit()
    }

    onBackgroundPointerDown(clickPosition: Point): void { }

    onBackgroundPointerUp(clickPosition: Point): void {
        this.exit()
    }

    render() {
        this._renderer.render()
    }

    exit() {
        const editor = Editor.getEditor()
        const selection = editor.selectionManager.getSelection()

        if (selection.isEmpty()) {
            this.selectTool.setState(new FreeSelectState(this.selectTool))
        } else {

            editor.actionManager.push(
                new SetSelectionAction(selection)
            )

            this.selectTool.setState(new SelectionState(this.selectTool))
        }
    }

}