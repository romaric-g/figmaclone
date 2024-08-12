import { Container, Graphics, GraphicsContext } from "pixi.js";
import { TreeRect } from "../../../tree/treeRect";
import { CachableRenderer } from "../cachableRenderer";
import { EventsManger } from "../../../event/eventManager";

export class RectRenderer implements CachableRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;
    private element: TreeRect;
    private eventManager: EventsManger;

    constructor(element: TreeRect, pixiContainer: Container, eventManager: EventsManger) {
        this.graphics = new Graphics()
        this.element = element;
        this.graphicsContainer = pixiContainer;
        this.eventManager = eventManager;
    }

    onInit() {
        this.graphicsContainer.addChild(this.graphics)
        this.setupEvents()
    }

    setupEvents() {

        this.graphics.on('pointerdown', (event) => {
            if (event.button === 2) return
            this.eventManager.onElementPressDown.emit({
                element: this.element,
                pointerPosition: event.global,
                button: event.button
            })

        });
        this.graphics.on('pointerup', (event) => {
            if (event.button === 2) return
            this.eventManager.onElementPressUp.emit({
                element: this.element,
                button: event.button,
                pointerPosition: event.global
            })
        })
        this.graphics.on('pointerupoutside', (event) => {
            if (event.button === 2) return
            this.eventManager.onElementPressUp.emit({
                element: this.element,
                button: event.button,
                pointerPosition: event.global
            })
        })

        this.graphics.on('rightdown', (event) => {
            this.eventManager.onElementRightDown.emit({
                element: this.element,
                pointerPosition: event.global,
                originalEvent: event
            })
        })

        this.graphics.on('pointerenter', (event) => {
            if ((event.nativeEvent.target as HTMLElement).tagName === "CANVAS") {
                this.eventManager.onElementHoverOn.emit({ component: this.element })
            }
        });

        this.graphics.on('pointerleave', (event) => {
            if ((event.nativeEvent.target as HTMLElement).tagName === "CANVAS") {
                this.eventManager.onElementHoverOff.emit({ component: this.element })
            }
        });

        this.graphics.eventMode = "static"
    }

    onDestroy() {
        this.graphicsContainer.removeChild(this.graphics)
    }

    render(zIndex: number) {
        const commonContext = new GraphicsContext()
            .rect(0, 0, this.element.width, this.element.height)
            .fill(this.element.fillColor)
            .stroke({
                width: this.element.borderWidth,
                color: this.element.borderColor,
                alignment: 1
            })

        this.graphics.zIndex = zIndex;
        this.graphics.context = commonContext
        this.graphics.x = this.element.x
        this.graphics.y = this.element.y
    }

}