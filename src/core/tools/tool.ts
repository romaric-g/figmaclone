import { ToolType } from "../../ui/subjects";

export abstract class Tool {
    readonly toolType: ToolType;

    constructor(toolType: ToolType) {
        this.toolType = toolType;
    }

    abstract enable(): void;

    abstract disable(): void;

}
