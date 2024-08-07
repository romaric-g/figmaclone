import { Graphics, GraphicsContext } from "pixi.js";
import { CanvasManager } from "../canvasManager";


export class SelectionLayer {
    private _canvasApp: CanvasManager;
    private _backgroundContainer: Graphics;

    constructor(canvasApp: CanvasManager) {
        this._canvasApp = canvasApp;
        this._backgroundContainer = new Graphics()
        this._backgroundContainer.eventMode = "none"
        this._backgroundContainer.interactive = false
    }

    init() {
        this._backgroundContainer.context = new GraphicsContext()
            .rect(0, 0, this._canvasApp.getCanvas().width, this._canvasApp.getCanvas().height)

        this.setupEvents()
    }

    setupEvents() {

    }

    getContainer() {
        return this._backgroundContainer;
    }
}