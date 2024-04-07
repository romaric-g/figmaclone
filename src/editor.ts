import { Application, Sprite, Assets, Container, Graphics, GraphicsContext, Point } from 'pixi.js';
import { Element } from './element';
import { KeyboardController } from './keyboardController';
import { Selector } from './selector';

export class Editor {

    readonly keyboardController: KeyboardController;

    private _app: Application;
    private _backgroundContainer: Graphics;
    private _elementsContainer: Container;

    private _elements: Element[] = [];
    private _selector: Selector;

    constructor() {
        this._app = new Application()
        this._backgroundContainer = new Graphics()
        this._backgroundContainer.eventMode = "static"
        this._elementsContainer = new Container()
        this._elementsContainer.eventMode = "static"

        this._selector = new Selector()

        this.keyboardController = new KeyboardController()
    }

    async init(htmlElement: HTMLElement) {
        await this._app.init({
            width: 700,
            height: 400
        })

        this._backgroundContainer.context = new GraphicsContext()
            .rect(0, 0, this._app.canvas.width, this._app.canvas.height)
            .fill("white")
            .stroke({
                width: 2,
                color: "black"
            })

        this._backgroundContainer.on("pointerdown", (event) => this.onBackgroundPointerDownHandler())

        this._elementsContainer.on('globalpointermove', (event) => {
            this._selector.pointerMove(event.global)
        })


        this._app.stage.addChild(this._backgroundContainer)
        this._app.stage.addChild(this._elementsContainer)

        htmlElement.appendChild(this._app.canvas);
    }

    async addElement(element: Element) {
        this._elements.push(element)
        this._elementsContainer.addChild(element.getContainer())
        this._app.ticker.add(() => {
            element.render()
            this._selector.clearCache()
        });

        element.setEditorContext(this)

    }

    onBackgroundPointerDownHandler() {
        if (!this.keyboardController.keys.shift.pressed) {
            this._selector.unselectAll()
            this._selector.disableSelectedElementPression()
        }
    }

    onElementPointerDown(element: Element, pointerPosition: Point) {
        const selectionElement = this._selector.getRegistredElement(element)
        const selectedElements = this._selector.getSelectedElement()

        const isShift = this.keyboardController.keys.shift.pressed;

        if (selectedElements.length > 1) { // Multiple selection
            if (isShift) {
                if (!selectionElement.isSelected()) {
                    selectionElement.select()
                } else {
                    selectionElement.pressUpUnselectable()
                }
            } else {
                if (!selectionElement.isSelected()) {
                    this._selector.unselectAll()
                    selectionElement.select()
                }
            }
        } else { // Single selection
            if (isShift) {
                if (!selectionElement.isSelected()) {
                    selectionElement.select()
                }
            } else {
                if (!selectionElement.isSelected()) {
                    this._selector.unselectAll()
                    selectionElement.select()
                } else {
                    selectionElement.pressUpUnselectable()
                }
            }
        }
        this._selector.activateMoov(element, pointerPosition)
    }

    onElementPointerUp(element: Element) {
        const isShift = this.keyboardController.keys.shift.pressed;
        const selectionElement = this._selector.getRegistredElement(element)

        if (this._selector.selectedElementPressionIsActivate()) {
            if (!this._selector.selectedElementPressionMove()) {

                if (isShift) {
                    if (selectionElement.isPressUpUnselectable()) {
                        selectionElement.unselect()
                    }
                } else {
                    if (this._selector.getSelectedElement().length > 1) {
                        if (selectionElement.isSelected()) {
                            this._selector.unselectAll()
                            selectionElement.select()
                        } else {
                            selectionElement.select()
                        }
                    } else {
                        if (selectionElement.isPressUpUnselectable()) {
                            this._selector.unselectAll()
                        } else {
                            this._selector.unselectAll()
                            selectionElement.select()
                        }
                    }
                }
            }

            this._selector.disableSelectedElementPression()
        }
    }

}

