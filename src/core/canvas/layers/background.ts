import { Graphics, GraphicsContext } from "pixi.js";
import { CanvasApp } from "../app";


export class BackgroundLayer {
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
            .fill("white")

        this.setupEvents()
    }

    setupEvents() {
        const eventsManager = this._canvasApp.getEditor().eventsManager

        this._backgroundContainer.on("pointerdown", (event) => eventsManager.onBackgroundPressDown.emit({
            position: event.global
        }))

        this._backgroundContainer.on("pointerup", (event) => eventsManager.onBackgroundPressUp.emit({
            position: event.global
        }))

        this._backgroundContainer.on('pointerdown', (event) => eventsManager.onPointerDown.emit({
            position: event.global,
            onBackground: true
        }))

        this._backgroundContainer.on('pointerup', (event) => eventsManager.onPointerUp.emit({
            position: event.global,
            onBackground: true
        }))
    }

    getContainer() {
        return this._backgroundContainer;
    }
}