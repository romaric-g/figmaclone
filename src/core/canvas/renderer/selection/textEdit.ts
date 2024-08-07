import { CanvasTextMetrics, Container, Graphics, GraphicsContext, TextStyle } from "pixi.js";
import { TreeText } from "../../../tree/treeText";
import { Editor } from "../../../editor";
import { KeyboardAttach } from "../../../keyboard/keyboardAttach";
import { KeyboardAction } from "../../../keyboard/keyboardAction";
import { TextRenderer } from "../tree/textRenderer";
import * as TextEditUtils from "./textEditUtils"

export class TextEditRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;
    private element: TreeText;

    private editor: Editor;
    private editIndex: number = 0;
    private prevAttach?: KeyboardAttach;

    private lineIndicatorIsShow = true;
    private indicatorIntervalId: NodeJS.Timeout | null = null;

    constructor(
        graphicsContainer: Container,
        editor: Editor,
        element: TreeText
    ) {
        this.graphics = new Graphics()
        this.graphicsContainer = graphicsContainer;
        this.editor = editor;
        this.element = element;
    }

    stopLineIndicator() {
        if (this.indicatorIntervalId != null) {
            clearInterval(this.indicatorIntervalId);
            this.indicatorIntervalId = null;
        }
    }

    startLineIndicator() {
        this.stopLineIndicator()

        this.lineIndicatorIsShow = true;

        this.indicatorIntervalId = setInterval(() => {
            this.lineIndicatorIsShow = !this.lineIndicatorIsShow;
        }, 500);
    }

    render() {
        const style = TextRenderer.getTextStyle(this.element.width)
        const positionConverter = this.editor.positionConverter

        const startPoint = positionConverter.getCanvasPosition(this.element.position)
        const [width, height] = positionConverter.getCanvasSize(this.element.width, this.element.height)

        const context = new GraphicsContext()
            .rect(0, 0, width, height)
            .stroke({
                width: 1,
                color: "blue"
            })

        if (this.lineIndicatorIsShow) {

            const text = this.element.text;
            const position = TextEditUtils.getIndexPosition(this.editIndex, text, style)

            if (position) {

                const [
                    canvasWidth,
                    canvasHeight
                ] = positionConverter.getCanvasSize(position.x, position.y);

                const [_, barHeight] = positionConverter.getCanvasSize(0, 25)

                context.moveTo(canvasWidth, canvasHeight)
                    .lineTo(canvasWidth, canvasHeight + barHeight)
                    .stroke({
                        width: 1,
                        a: 1,
                        color: {
                            r: 40,
                            g: 40,
                            b: 40
                        }
                    })
            }
        }

        this.graphics.zIndex = 100000;
        this.graphics.context = context;
        this.graphics.x = startPoint.x;
        this.graphics.y = startPoint.y;
    }


    getMaxIndex() {
        return this.element.text.length;
    }

    attachEvents() {
        const keyAttach = new KeyboardAttach()

        this.editIndex = this.element.text.length
        this.prevAttach = Editor.getEditor().keyboardManager.getAttach()

        keyAttach.addAction(
            new KeyboardAction("left", (type) => {
                if (this.editIndex > 0 && type == "down") {
                    this.startLineIndicator()
                    this.editIndex--;
                }
            })
        )

        keyAttach.addAction(
            new KeyboardAction("right", (type) => {
                const style = TextRenderer.getTextStyle(this.element.width)
                if (this.editIndex < this.getMaxIndex() && type == "down") {
                    this.startLineIndicator()
                    this.editIndex++;
                }
            })
        )

        keyAttach.addAction(
            new KeyboardAction("backspace", (type) => {
                if (type == "down") {
                    let prevText = this.element.text;
                    if (this.editIndex > 0) {
                        this.startLineIndicator()
                        this.element.text = prevText.slice(0, this.editIndex - 1) + prevText.slice(this.editIndex);
                        this.editIndex--;
                    }
                }
            })
        )


        keyAttach.addListener((event: KeyboardEvent, type: "up" | "down") => {
            if (type === "down") {
                let newChar = "";
                if (event.key === "Enter") {
                    newChar = "\n";
                } else if (event.key.length === 1) {
                    newChar = event.key;
                }

                let newText = this.element.text;
                if (newChar) {
                    if (newText.length >= this.editIndex) {
                        newText = newText.slice(0, this.editIndex) + newChar + newText.slice(this.editIndex);
                    } else {
                        newText += newChar;
                    }
                    this.element.text = newText;
                    this.editIndex += 1;

                    this.startLineIndicator()

                    console.log("this.element.text", this.element.text + ";")
                }
            }
        })

        Editor.getEditor().keyboardManager.setAttach(keyAttach)
    }

    detachEvents() {
        if (this.prevAttach) {
            Editor.getEditor().keyboardManager.setAttach(this.prevAttach)
            this.prevAttach = undefined;
        }
    }

    onInit() {
        this.graphicsContainer.addChild(this.graphics)
        this.attachEvents()
        this.startLineIndicator()
    }

    onDestroy() {
        this.graphicsContainer.removeChild(this.graphics)
        this.detachEvents()
    }

}