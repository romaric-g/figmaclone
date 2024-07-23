import { Container } from "pixi.js";
import { CanvasApp } from "../app";


export class TreeLayer {

    private _canvasApp: CanvasApp;
    private _treeContainer: Container;

    constructor(canvasApp: CanvasApp) {
        this._canvasApp = canvasApp;
        this._treeContainer = new Container()
        this._treeContainer.eventMode = "static"
    }

    init() {
        this.setupEvents()
    }

    setupEvents() {

        const eventsManager = this._canvasApp.getEditor().eventsManager;

        this._treeContainer.on('globalpointermove', (event) => eventsManager.onPointerMove.emit({
            position: event.global
        }))

        this._treeContainer.on('pointerdown', (event) => eventsManager.onPointerDown.emit({
            position: event.global,
            onBackground: false,
            button: event.button
        }))

        this._treeContainer.on('pointerup', (event) => eventsManager.onPointerUp.emit({
            position: event.global,
            onBackground: false,
            button: event.button
        }))

    }

    getContainer() {
        return this._treeContainer;
    }
}