import { currentToolSubject, ToolType } from "../../ui/subjects";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { RectTool } from "./rectTool";
import { FreeSelectState } from "./selectStates/freeSelectState";
import { SelectionState } from "./selectStates/selectionState";
import { SelectTool } from "./selectTool";
import { TextTool } from "./textTool";
import { Tool } from "./tool";
import { ToolUtils } from "./toolUtils";

export class ToolManager {

    private _selectTool: SelectTool;
    private _rectTool: RectTool;
    private _textTool: TextTool;

    private _currentTool?: Tool;
    private _freezed = false;

    constructor(editor: Editor) {
        this._selectTool = new SelectTool()
        this._rectTool = new RectTool()
        this._textTool = new TextTool()
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
            case "rect":
                newTool = this._rectTool;
                break;
            case "text":
                newTool = this._textTool;
                break;
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

    resetSelection(selection: SelectedComponentsModifier) {
        if (selection.isEmpty()) {
            this._selectTool.setState(
                new FreeSelectState(this._selectTool)
            )
        } else {
            this._selectTool.setState(
                new SelectionState(this._selectTool)
            )
        }
    }

    get utils() {
        return new ToolUtils(this)
    }
}