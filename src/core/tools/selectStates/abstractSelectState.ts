import { Point } from "pixi.js";
import { SelectTool } from "../selectTool";
import { Element } from "../../element";

export abstract class SelectToolState {

    protected selectTool: SelectTool;

    constructor(selectTool: SelectTool) {
        this.selectTool = selectTool;
    }

    abstract onInit(): void

    abstract onDestroy(): void

    abstract onClickDown(element: Element, shift: boolean, pointerPosition: Point): void

    abstract onClickUp(element: Element, shift: boolean): void

    abstract onMove(newPosition: Point): void

    abstract onBackgroundPointerDown(clickPosition: Point): void

    abstract onBackgroundPointerUp(clickPosition: Point): void

}

