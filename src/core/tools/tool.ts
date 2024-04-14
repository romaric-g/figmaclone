import { Point } from "pixi.js";
import { Editor } from "../editor";
import { Element } from "../element";
import { ElementPressDownEventData, ElementPressUpEventData } from "../eventManager";
import { ToolType } from "./toolManager";

export abstract class Tool {
    readonly editor: Editor;
    readonly toolType: ToolType;

    constructor(editor: Editor, toolType: ToolType) {
        this.editor = editor;
        this.toolType = toolType;
    }

    abstract enable(): void;

    abstract disable(): void;
}
