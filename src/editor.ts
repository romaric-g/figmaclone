import { Application, Sprite, Assets } from 'pixi.js';
import { Element } from './element';

export class Editor {
    private _app: Application;
    private _elements: Element[] = [];
    private _selectedElement?: Element;

    constructor() {
        this._app = new Application()
    }

    async init(htmlElement: HTMLElement) {
        await this._app.init()

        htmlElement.appendChild(this._app.canvas);
    }

    async addElement(element: Element) {
        this._elements.push(element)
        this._app.stage.addChild(element.getContainer())
        this._app.ticker.add(() => {
            element.update()
        });

        element.setEditorContext(this)

    }

    requestSelect(element: Element) {
        if (this._selectedElement) {
            this._selectedElement.deselect()
        }
        this._selectedElement = element;
        this._selectedElement.select()
    }
}