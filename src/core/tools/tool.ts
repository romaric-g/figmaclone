import { ToolType } from "./toolManager";

export abstract class Tool {
    readonly toolType: ToolType;

    constructor(toolType: ToolType) {
        this.toolType = toolType;
    }

    abstract enable(): void;

    abstract disable(): void;

    abstract render(): void

}
