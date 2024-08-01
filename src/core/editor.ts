import { Point, ApplicationOptions } from 'pixi.js';
import { SelectionManager } from './selections/selectionManager';
import { EventsManger } from './event/eventManager';
import { TreeManager } from './tree/treeManager';
import { ToolManager } from './tools/toolManager';
import { Zoom } from './zoom';
import { CanvasApp } from './canvas/app';
import { KeyboardManager } from './keyboard/keyboardManager';
import { CanvasAttach } from './keyboard/canvas/canvasAttach';
import { ActionManager } from './actions/actionManger';
import { MenuManager } from './menu/menuManager';
import { Snapshot } from './history/snapshot';
import { History } from './history/history';
import { SelectedComponentsModifier } from './selections/selectedComponentsModifier';
import { SquaredZone } from './utils/squaredZone';
import { deserializeTreeComponent } from './tree/serialized/deserializeComponent';

console.log("log Editor")

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
    readonly menuManager: MenuManager;
    readonly zoom: Zoom;
    readonly history: History;

    readonly canvasApp: CanvasApp;


    constructor() {
        this.canvasApp = new CanvasApp(this)

        this.selectionManager = new SelectionManager()
        this.eventsManager = new EventsManger()
        this.treeManager = new TreeManager()
        this.toolManager = new ToolManager(this)
        this.keyboardManager = new KeyboardManager()
        this.actionManager = new ActionManager()
        this.menuManager = new MenuManager()
        this.zoom = new Zoom(this)
        this.history = new History()
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this.canvasApp.init(options)

        this.menuManager.init()
        this.treeManager.init()
        this.toolManager.init()
        this.selectionManager.init()

        this.keyboardManager.setAttach(new CanvasAttach())

        this.history.add(this.makeSnapshot())
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

    getDrawingSquaredZone(canvasZone: SquaredZone): SquaredZone {
        const minPoint = this.getDrawingPosition(new Point(canvasZone.minX, canvasZone.maxX))
        const maxPoint = this.getDrawingPosition(new Point(canvasZone.minY, canvasZone.maxY))

        return {
            minX: minPoint.x,
            minY: minPoint.y,
            maxX: maxPoint.x,
            maxY: maxPoint.y
        }
    }

    getCanvasSquaredZone(drawingZone: SquaredZone): SquaredZone {
        const minPoint = this.getCanvasPosition(new Point(drawingZone.minX, drawingZone.minY))
        const maxPoint = this.getCanvasPosition(new Point(drawingZone.maxX, drawingZone.maxY))

        return {
            minX: minPoint.x,
            minY: minPoint.y,
            maxX: maxPoint.x,
            maxY: maxPoint.y
        }
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

    makeSnapshot(): Snapshot {

        let selectedIds = this.selectionManager.getSelection().getSelectedIds()
        let treeComponents = this.treeManager.getTree().serialize().props.components
        return new Snapshot(selectedIds, treeComponents)

    }

    restore(snapshot: Snapshot) {
        const components = snapshot.treeComponents.map((c) => deserializeTreeComponent(c)).filter(c => !!c)
        this.treeManager.restoreTree(components)

        const newComponentsSelection = this.treeManager.getTree().getComponents().filter((c) => {
            const id = c.getId()

            if (id) {
                return snapshot.selectedIds.includes(id)
            }
            return false;
        })

        this.selectionManager.setSelection(new SelectedComponentsModifier(newComponentsSelection))
        this.toolManager.resetSelection(this.selectionManager.getSelection())
    }


}

