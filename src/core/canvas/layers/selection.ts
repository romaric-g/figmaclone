import { Graphics, GraphicsContext } from "pixi.js";
import { CanvasApp } from "../app";


export class SelectionLayer {
    private _canvasApp: CanvasApp;
    private _backgroundContainer: Graphics;

    constructor(canvasApp: CanvasApp) {
        this._canvasApp = canvasApp;
        this._backgroundContainer = new Graphics()
        this._backgroundContainer.eventMode = "static"
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