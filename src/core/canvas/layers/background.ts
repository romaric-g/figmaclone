import { Graphics, GraphicsContext } from "pixi.js";
import { CanvasManager } from "../canvasManager";


export class BackgroundLayer {
    private _canvasApp: CanvasManager;
    private _backgroundContainer: Graphics;

    constructor(canvasApp: CanvasManager) {
        this._canvasApp = canvasApp;
        this._backgroundContainer = new Graphics()
        this._backgroundContainer.eventMode = "static"
    }

    init() {
        this._backgroundContainer.context = new GraphicsContext()
            .rect(0, 0, this._canvasApp.getCanvas().width, this._canvasApp.getCanvas().height)
            .fill("#EEE")

        this.setupEvents()
    }

    render() {
        this._backgroundContainer.context = new GraphicsContext()
            .rect(0, 0, this._canvasApp.getCanvas().width, this._canvasApp.getCanvas().height)
            .fill("#EEE")
    }

    setupEvents() {
        const eventsManager = this._canvasApp.getEditor().eventsManager

        this._backgroundContainer.on("pointerdown", (event) => {
            if (event.button === 2) return
            eventsManager.onBackgroundPressDown.emit({
                position: event.global,
                button: event.button
            })
        })

        this._backgroundContainer.on("pointerup", (event) => {
            if (event.button === 2) return
            eventsManager.onBackgroundPressUp.emit({
                position: event.global,
                button: event.button
            })
        })

        this._backgroundContainer.on('pointerdown', (event) => {
            if (event.button === 2) return
            eventsManager.onPointerDown.emit({
                position: event.global,
                onBackground: true,
                button: event.button
            })
        })

        this._backgroundContainer.on('pointerup', (event) => {
            if (event.button === 2) return
            eventsManager.onPointerUp.emit({
                position: event.global,
                onBackground: true,
                button: event.button
            })
        })


        this._backgroundContainer.on("rightdown", (event) => {
            eventsManager.onPointerRightDown.emit({
                pointerPosition: event.global.clone(),
                originalEvent: event
            })
        })

    }

    getContainer() {
        return this._backgroundContainer;
    }
}