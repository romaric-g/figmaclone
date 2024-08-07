import { ApplicationOptions } from 'pixi.js';
import { SelectionManager } from './selections/selectionManager';
import { EventsManger } from './event/eventManager';
import { TreeManager } from './tree/treeManager';
import { ToolManager } from './tools/toolManager';
import { Zoom } from './zoom';
import { CanvasManager } from './canvas/canvasManager';
import { KeyboardManager } from './keyboard/keyboardManager';
import { CanvasAttach } from './keyboard/canvas/canvasAttach';
import { ActionManager } from './actions/actionManger';
import { MenuManager } from './menu/menuManager';
import { Snapshot } from './history/snapshot';
import { History } from './history/history';
import { SelectedComponentsModifier } from './selections/selectedComponentsModifier';
import { deserializeTreeComponent } from './tree/serialized/deserializeComponent';
import { PositionConverter } from './canvas/conversion/PositionConverter';

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

    readonly canvasManager: CanvasManager;

    readonly positionConverter: PositionConverter;


    constructor() {
        this.canvasManager = new CanvasManager(this)
        this.selectionManager = new SelectionManager()
        this.eventsManager = new EventsManger()
        this.treeManager = new TreeManager()
        this.toolManager = new ToolManager(this)
        this.keyboardManager = new KeyboardManager()
        this.actionManager = new ActionManager()
        this.menuManager = new MenuManager()
        this.zoom = new Zoom(this)
        this.history = new History(150)

        this.positionConverter = new PositionConverter(this.canvasManager.getTreeContainer())
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this.canvasManager.init(options)

        this.menuManager.init()
        this.treeManager.init()
        this.toolManager.init()
        this.selectionManager.init()

        this.keyboardManager.setAttach(new CanvasAttach())

        this.history.add(this.makeSnapshot())
    }

    getCanvas() {
        return this.canvasManager.getCanvas();
    }

    getBackgroundContainer() {
        return this.canvasManager.getBackgroundContainer();
    }

    getTreeContainer() {
        return this.canvasManager.getTreeContainer();
    }

    makeSnapshot(): Snapshot {

        let selectedIds = this.selectionManager.getSelectionModifier().getSelectedIds()
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

        this.selectionManager.setSelectionModifier(new SelectedComponentsModifier(newComponentsSelection))
        this.toolManager.resetSelection(this.selectionManager.getSelectionModifier())
    }


}

