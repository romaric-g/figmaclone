import { Point, ApplicationOptions } from 'pixi.js';
import { KeyboardController } from './keyboardController';
import { Selector } from './selector';
import { EventsManger } from './eventManager';
import { Tree } from './tree';
import { ToolManager } from './tools/toolManager';
import { Zoom } from './zoom';
import { CanvasApp } from './canvas/app';

export class Editor {
    private static editor: Editor = new Editor()

    public static getEditor(): Editor {
        return this.editor;
    }

    readonly keyboardController: KeyboardController;
    readonly selector: Selector;
    readonly eventsManager: EventsManger;
    readonly tree: Tree;
    readonly toolManager: ToolManager;
    readonly zoom: Zoom;

    readonly canvasApp: CanvasApp;


    constructor() {
        this.canvasApp = new CanvasApp(this)

        this.selector = new Selector()
        this.keyboardController = new KeyboardController()
        this.eventsManager = new EventsManger()
        this.tree = new Tree(this)
        this.toolManager = new ToolManager(this)
        this.zoom = new Zoom(this)
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this.canvasApp.init(options)

        this.toolManager.init()
    }

    getDrawingSize(width: number, height: number) {
        const scale = this.canvasApp.getTreeContainer().scale

        return [width / scale.x, height / scale.y]
    }

    getCanvasSize(width: number, height: number) {
        const scale = this.canvasApp.getTreeContainer().scale

        return [scale.x * width, scale.y * height]
    }

    getDrawingPosition(canvasPosition: Point) {
        return this.canvasApp.getTreeContainer().toLocal(canvasPosition)
    }

    getCanvasPosition(drawingPosition: Point) {
        return this.canvasApp.getTreeContainer().toGlobal(drawingPosition)
    }

    getCanvas() {
        return this.canvasApp.getCanvas();
    }

    getBackgroundContainer() {
        return this.canvasApp.getBackgroundContainer();
    }

    getTreeContainer() {
        return this.canvasApp.getTreeContainer();
    }
}

