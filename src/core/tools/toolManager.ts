import { currentToolSubject } from "../../ui/subjects";
import { Editor } from "../editor";
import { DrawTool } from "./drawTool";
import { SelectTool } from "./selectTool";
import { Tool } from "./tool";

export type ToolType = "select" | "draw"

export class ToolManager {

    private _selectTool: SelectTool;
    private _drawTool: DrawTool;

    private _currentTool?: Tool;
    private _freezed = false;

    constructor(editor: Editor) {
        this._selectTool = new SelectTool(editor)
        this._drawTool = new DrawTool(editor)
    }

    init() {
        this.setCurrentTool("select")
    }

    getCurrentTool() {
        return this._currentTool;
    }

    getCurrentToolType() {
        return this._currentTool?.toolType;
    }

    setCurrentTool(toolType: ToolType) {
        let newTool: Tool;

        switch (toolType) {
            case "select":
                newTool = this._selectTool;
                break
            case "draw":
                newTool = this._drawTool;
                break
        }

        if (newTool && newTool != this._currentTool) {
            if (!this._freezed) {
                if (this._currentTool) {
                    this._currentTool.disable()
                }
                this._currentTool = newTool;
                this._currentTool.enable()
            } else {
                this._currentTool = newTool
            }

            currentToolSubject.next(toolType)
        }
    }

    freeze() {
        if (!this._freezed) {
            this._freezed = true
            if (this._currentTool) {
                this._currentTool.disable()
            }
        }
    }

    unfreeze() {
        if (this._freezed) {
            this._freezed = false
            if (this._currentTool) {
                this._currentTool.enable()
            }
        }
    }

    isFreezed() {
        return this._freezed;
    }

    render() {
        this.getCurrentTool()?.render()
    }


}