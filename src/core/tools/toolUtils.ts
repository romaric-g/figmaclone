import { DrawTool } from "./drawTool";
import { DragSelectionState } from "./selectStates/dragSelection";
import { MovableSelectionState } from "./selectStates/movableSelection";
import { ReshapeSelectState } from "./selectStates/reshapeSelect";
import { TextEditState } from "./selectStates/textEditState";
import { SelectTool } from "./selectTool";
import { ToolManager } from "./toolManager";

export class ToolUtils {

    private toolManager: ToolManager;

    constructor(toolManager: ToolManager) {
        this.toolManager = toolManager;
    }

    getSelectTool() {
        const currentTool = this.toolManager.getCurrentTool()
        if (currentTool instanceof SelectTool) {
            return currentTool;
        }
        return undefined;
    }

    getDrawTool() {
        const currentTool = this.toolManager.getCurrentTool()
        if (currentTool instanceof DrawTool) {
            return currentTool;
        }
        return undefined;
    }

    getDragState() {
        const state = this.getSelectTool()?.getCurrentState()

        if (state && state instanceof DragSelectionState) {
            return state;
        }

        return undefined;
    }

    getMovableState() {
        const state = this.getSelectTool()?.getCurrentState()

        if (state && state instanceof MovableSelectionState) {
            return state;
        }

        return undefined;
    }

    getTextEditingState() {
        const state = this.getSelectTool()?.getCurrentState()

        if (state && state instanceof TextEditState) {
            return state;
        }

        return undefined;
    }

    getReshapeState() {
        const state = this.getSelectTool()?.getCurrentState()

        if (state && state instanceof ReshapeSelectState) {
            return state;
        }

        return undefined;
    }
}