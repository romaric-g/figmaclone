import { Point } from "pixi.js";
import { SelectTool } from "../selectTool";
import { SelectToolState } from "./abstractSelectState";
import { FreeSelectState } from "./freeSelectState";
import { Editor } from "../../editor";
import { TreeComponent } from "../../tree/treeComponent";
import { SelectedComponentsModifier } from "../../selections/selectedComponentsModifier";
import { SelectionState } from "./selectionState";
import { UpdatingSelectionAction } from "../../actions/updatingSelectionAction";
import { SetSelectionAction } from "../../actions/setSelectionAction";
import { SquaredZone } from "../../utils/squaredZone";
import { TreeBox } from "../../tree/treeBox";

// Quand l'utilisateur presse le bouton gauche de sa souris et alors peut bouger 
// sa souris pour selectionner un ensemble d'elements
export class DragSelectionState extends SelectToolState {

    private _sourceClickedPosition: Point;
    private _lastDragPosition?: Point;

    constructor(selectTool: SelectTool, sourceClickedPosition: Point) {
        super(selectTool)
        this._sourceClickedPosition = sourceClickedPosition.clone()
    }

    getFromClickedPosition() {
        return this._sourceClickedPosition;
    }

    getDragPosition() {
        return this._lastDragPosition;
    }

    getCanvasCoveredZone(): SquaredZone | undefined {

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

        const selectionCanvasCoveredZone = this.getCanvasCoveredZone()

        if (!selectionCanvasCoveredZone) {
            return
        }

        const toSelectComponents: TreeComponent[] = []

        const rootComponents = editor.treeManager.getTree().getComponents()

        for (const rootComponent of rootComponents) {
            const componentDrawingCoveredZone = rootComponent.getSquaredZone()

            if (!componentDrawingCoveredZone) {
                continue;
            }

            const componentCanvasCoveredZone = editor.positionConverter.getCanvasSquaredZone(componentDrawingCoveredZone)

            const isLeft = componentCanvasCoveredZone.maxX < selectionCanvasCoveredZone.minX;
            const isRight = componentCanvasCoveredZone.minX > selectionCanvasCoveredZone.maxX;
            const isAbove = componentCanvasCoveredZone.maxY < selectionCanvasCoveredZone.minY;
            const isBelow = componentCanvasCoveredZone.minY > selectionCanvasCoveredZone.maxY;

            if (!isLeft && !isRight && !isAbove && !isBelow) {
                toSelectComponents.push(rootComponent)
            }
        }

        editor.actionManager.push(
            new UpdatingSelectionAction(new SelectedComponentsModifier(toSelectComponents))
        )
    }

    onInit(): void {
    }

    onDestroy(): void {
    }

    onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point, double: boolean): void { }

    onClickUp(element: TreeBox, shift: boolean): void {
        this.exit()
    }

    onBackgroundPointerDown(clickPosition: Point): void { }

    onBackgroundPointerUp(clickPosition: Point): void {
        this.exit()
    }

    exit() {
        const editor = Editor.getEditor()
        const selection = editor.selectionManager.getSelectionModifier()

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