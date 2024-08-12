import { AbstractText, Container, Graphics, Text, TextStyle } from "pixi.js";
import { CachableRenderer } from "../cachableRenderer";
import { EventsManger } from "../../../event/eventManager";
import { TreeText } from "../../../tree/treeText";
import { TextEditUtils } from "../../../utils/textEditUtils";

export class TextRenderer implements CachableRenderer {

    private graphicsContainer: Container;
    private text: Text;
    private element: TreeText;
    private graphics: Graphics;
    private eventManager: EventsManger;

    constructor(element: TreeText, pixiContainer: Container, eventManager: EventsManger) {
        this.text = new Text()
        this.graphics = new Graphics()
        this.element = element;
        this.graphicsContainer = pixiContainer;
        this.eventManager = eventManager;
    }

    get textElement(): AbstractText {
        return this.text;
    }

    onInit() {
        this.graphicsContainer.addChild(this.textElement)
        this.graphicsContainer.addChild(this.graphics)
        this.setupEvents()
    }

    setupEvents() {

        this.textElement.on('pointerdown', (event) => {
            if (event.button === 2) return
            this.eventManager.onElementPressDown.emit({
                element: this.element,
                pointerPosition: event.global,
                button: event.button
            })

        });
        this.textElement.on('pointerup', (event) => {
            if (event.button === 2) return
            this.eventManager.onElementPressUp.emit({
                element: this.element,
                button: event.button,
                pointerPosition: event.global
            })
        })
        this.textElement.on('pointerupoutside', (event) => {
            if (event.button === 2) return
            this.eventManager.onElementPressUp.emit({
                element: this.element,
                button: event.button,
                pointerPosition: event.global
            })
        })

        this.textElement.on('rightdown', (event) => {
            this.eventManager.onElementRightDown.emit({
                element: this.element,
                pointerPosition: event.global,
                originalEvent: event
            })
        })

        this.textElement.on('pointerenter', (event) => {
            if ((event.nativeEvent.target as HTMLElement).tagName === "CANVAS") {
                this.eventManager.onElementHoverOn.emit({ component: this.element })
            }
        });

        this.textElement.on('pointerleave', (event) => {
            if ((event.nativeEvent.target as HTMLElement).tagName === "CANVAS") {
                this.eventManager.onElementHoverOff.emit({ component: this.element })
            }
        });

        this.textElement.eventMode = "static"
    }

    onDestroy() {
        this.graphicsContainer.removeChild(this.textElement)
        this.graphicsContainer.removeChild(this.graphics)
    }

    render(zIndex: number) {

        const style = TextEditUtils.getTextStyle({
            wordWrapWidth: this.element.width,
            fontSize: this.element.fontSize,
            color: this.element.fillColor
        })

        const text = this.element.text;

        const formatedText = TextEditUtils.formatTextForRendering(text)

        this.text.zIndex = zIndex;
        this.text.x = this.element.x
        this.text.y = this.element.y
        this.text.text = formatedText;
        this.text.style = style
    }
}