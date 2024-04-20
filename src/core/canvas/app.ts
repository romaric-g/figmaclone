import { Application, ApplicationOptions, Container } from "pixi.js";
import { Editor } from "../editor";
import { BackgroundLayer } from "./layers/background";
import { TreeLayer } from "./layers/tree";
import { SelectionLayer } from "./layers/selection";


export class CanvasApp {
    private _editor: Editor;
    private _app: Application;

    private _backgroundLayer: BackgroundLayer;
    private _treeLayer: TreeLayer;
    private _selectionLayer: SelectionLayer;

    constructor(editor: Editor) {
        this._editor = editor;
        this._app = new Application()

        this._backgroundLayer = new BackgroundLayer(this)
        this._treeLayer = new TreeLayer(this)
        this._selectionLayer = new SelectionLayer(this)
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this._app.init(options)

        this._backgroundLayer.init()
        this._treeLayer.init()
        this._selectionLayer.init()

        this._app.stage.addChild(this._backgroundLayer.getContainer())
        this._app.stage.addChild(this._treeLayer.getContainer())
        this._app.stage.addChild(this._selectionLayer.getContainer())

        this._app.ticker.maxFPS = 90
        this._app.ticker.add(() => {

            this._treeLayer.getContainer().x = this.getEditor().zoom.getX()
            this._treeLayer.getContainer().y = this.getEditor().zoom.getY()
            this._treeLayer.getContainer().scale = this.getEditor().zoom.getCurrentScale()

            this.getEditor().treeManager.render()
        });
    }

    getTreeLayer() {
        return this._treeLayer;
    }

    getBackgroundLayer() {
        return this._backgroundLayer;
    }

    getSelectionLayer() {
        return this._selectionLayer;
    }

    getTreeContainer(): Container {
        return this._treeLayer.getContainer()
    }

    getBackgroundContainer(): Container {
        return this._backgroundLayer.getContainer()
    }

    getCanvas() {
        return this._app.canvas;
    }

    getEditor() {
        return this._editor;
    }

}