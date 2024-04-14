import { Point } from "pixi.js";
import { Element } from "../../element";
import { SelectTool } from "../selectTool";
import { SelectToolState } from "./abstractSelectState";
import { SelectionState } from "./selection";


export type ReshapeReference = "none" | "top" | "left" | "bottom" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"

export type CursorType = "ns-resize" | "ew-resize" | "nesw-resize" | "nwse-resize" | "default"

export function getCursorType(reshapeReference: ReshapeReference): CursorType {
    switch (reshapeReference) {
        case "top":
            return "ns-resize";
        case "left":
            return "ew-resize"
        case "bottom":
            return "ns-resize"
        case "right":
            return "ew-resize"
        case "top-left":
            return "nwse-resize"
        case "top-right":
            return "nesw-resize"
        case "bottom-left":
            return "nesw-resize"
        case "bottom-right":
            return "nwse-resize"
        default:
            return "default"
    }
}

export class ReshapeSelectState extends SelectToolState {

    private reshapeReference: ReshapeReference;
    private element: Element;
    private sourceClickedPosition: Point;

    private originalX: number = 0;
    private originalY: number = 0;
    private originalWidth: number = 0;
    private originalHeight: number = 0;

    constructor(selectTool: SelectTool, element: Element, reshapeReference: ReshapeReference, sourceClickedPosition: Point) {
        super(selectTool)
        this.reshapeReference = reshapeReference;
        this.element = element;
        this.sourceClickedPosition = sourceClickedPosition.clone();
    }

    private getMouvementVector(currentPointerPosition: Point) {
        const x = currentPointerPosition.x - this.sourceClickedPosition.x;
        const y = currentPointerPosition.y - this.sourceClickedPosition.y;

        return new Point(x, y)
    }


    onInit(): void {
        this.originalX = this.element.x;
        this.originalY = this.element.y;
        this.originalWidth = this.element.width;
        this.originalHeight = this.element.height;
    }
    onDestroy(): void {

    }
    onClickDown(element: Element, shift: boolean, pointerPosition: Point): void {
    }
    onClickUp(element: Element, shift: boolean): void {
        this.selectTool.setState(new SelectionState(this.selectTool))
    }
    onMove(newPosition: Point): void {
        const localPosition = this.selectTool.editor.getDrawingPosition(newPosition).clone()

        const moveVector = this.getMouvementVector(localPosition)

        let newX = this.originalX;
        let newY = this.originalY;
        let newWidth = this.originalWidth;
        let newHeight = this.originalHeight;

        if (this.reshapeReference === "top" || this.reshapeReference === "top-left" || this.reshapeReference === "top-right") {
            newY = this.originalY + moveVector.y
            newHeight = this.originalHeight - moveVector.y
            if (newHeight < 0) {
                newY = newY + newHeight
                newHeight = Math.abs(newHeight)
            }
        }
        if (this.reshapeReference === "bottom" || this.reshapeReference === "bottom-left" || this.reshapeReference === "bottom-right") {
            newHeight = this.originalHeight + moveVector.y
            if (newHeight < 0) {
                newY = newY + newHeight
                newHeight = Math.abs(newHeight)
            }
        }
        if (this.reshapeReference === "left" || this.reshapeReference === "top-left" || this.reshapeReference === "bottom-left") {
            newX = this.originalX + moveVector.x
            newWidth = this.originalWidth - moveVector.x
            if (newWidth < 0) {
                newX = newX + newWidth
                newWidth = Math.abs(newWidth)
            }
        }
        if (this.reshapeReference === "right" || this.reshapeReference === "top-right" || this.reshapeReference === "bottom-right") {
            newWidth = this.originalWidth + moveVector.x
            if (newWidth < 0) {
                newX = newX + newWidth
                newWidth = Math.abs(newWidth)
            }
        }


        this.element.x = newX;
        this.element.y = newY;
        this.element.width = newWidth;
        this.element.height = newHeight;

        this.selectTool.editor.selector.getSelection().emitChangeEvent()


    }
    onBackgroundPointerDown(clickPosition: Point): void {
    }
    onBackgroundPointerUp(clickPosition: Point): void {
        this.selectTool.setState(new SelectionState(this.selectTool))
    }

}