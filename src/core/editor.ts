import { Point, ApplicationOptions } from 'pixi.js';
import { KeyboardController } from './keyboardController';
import { SelectionManager } from './selectionManager';
import { EventsManger } from './eventManager';
import { TreeManager } from './tree/treeManager';
import { ToolManager } from './tools/toolManager';
import { Zoom } from './zoom';
import { CanvasApp } from './canvas/app';

export class Editor {
    private static editor: Editor = new Editor()

    public static getEditor(): Editor {
        return this.editor;
    }

    readonly keyboardController: KeyboardController;
    readonly selectionManager: SelectionManager;
    readonly eventsManager: EventsManger;
    readonly treeManager: TreeManager;
    readonly toolManager: ToolManager;
    readonly zoom: Zoom;

    readonly canvasApp: CanvasApp;


    constructor() {
        this.canvasApp = new CanvasApp(this)

        this.selectionManager = new SelectionManager()
        this.keyboardController = new KeyboardController()
        this.eventsManager = new EventsManger()
        this.treeManager = new TreeManager(this)
        this.toolManager = new ToolManager(this)
        this.zoom = new Zoom(this)
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this.canvasApp.init(options)

        this.treeManager.init()
        this.toolManager.init()
        this.selectionManager.init()

        this.keyboardController.addListener("backspace", (type) => {
            for (const element of this.selectionManager.getSelection().getFlatComponents()) {
                // this.tree.removeElement(element)
            }
        })

        this.keyboardController.addListener("left", (type) => {
            if (type == "down") {
                this.selectionManager.getSelection().addX(-5)
            }

        })

        this.keyboardController.addListener("right", (type) => {
            if (type == "down") {
                this.selectionManager.getSelection().addX(5)
            }
        })

        this.keyboardController.addListener("g", (type) => {
            if (type == "down") {
                if (this.keyboardController.keys.control.pressed) {
                    const selection = this.selectionManager.getSelection()
                    this.selectionManager.getRootContainer().groupeSelection(selection)
                }
            }
        })

        this.keyboardController.addListener("up", (type) => {
            if (type == "down") {
                this.selectionManager.getSelection().addY(-5)
            }

        })

        this.keyboardController.addListener("down", (type) => {
            if (type == "down") {
                this.selectionManager.getSelection().addY(5)
            }

        })
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

