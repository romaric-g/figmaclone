import { Point, ApplicationOptions } from 'pixi.js';
import { SelectionManager } from './selections/selectionManager';
import { EventsManger } from './eventManager';
import { TreeManager } from './tree/treeManager';
import { ToolManager } from './tools/toolManager';
import { Zoom } from './zoom';
import { CanvasApp } from './canvas/app';
import { KeyboardManager } from './keyboard/keyboardManager';
import { CanvasAttach } from './keyboard/canvas/canvasAttach';
import { ActionManager } from './actions/actionManger';

export class Editor {
    private static editor: Editor = new Editor()

    public static getEditor(): Editor {
        return this.editor;
    }

    readonly selectionManager: SelectionManager;
    readonly eventsManager: EventsManger;
    readonly treeManager: TreeManager;
    readonly toolManager: ToolManager;
    readonly keyboardManager: KeyboardManager;
    readonly actionManager: ActionManager;
    readonly zoom: Zoom;

    readonly canvasApp: CanvasApp;


    constructor() {
        this.canvasApp = new CanvasApp(this)

        this.selectionManager = new SelectionManager()
        this.eventsManager = new EventsManger()
        this.treeManager = new TreeManager(this)
        this.toolManager = new ToolManager(this)
        this.keyboardManager = new KeyboardManager()
        this.actionManager = new ActionManager()
        this.zoom = new Zoom(this)
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this.canvasApp.init(options)

        this.treeManager.init()
        this.toolManager.init()
        this.selectionManager.init()

        this.keyboardManager.setAttach(new CanvasAttach())
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

