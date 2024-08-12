import { Container, Graphics, GraphicsContext, TextStyle } from "pixi.js";
import { TreeText } from "../../../tree/treeText";
import { Editor } from "../../../editor";
import { KeyboardAttach } from "../../../keyboard/keyboardAttach";
import { KeyboardAction } from "../../../keyboard/keyboardAction";
import { TextEditUtils } from "../../../utils/textEditUtils"
import { TextEditState } from "../../../tools/selectStates/textEditState";

export class TextEditRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;
    private state: TextEditState;

    private editor: Editor;


    constructor(
        graphicsContainer: Container,
        editor: Editor,
        state: TextEditState
    ) {
        this.graphics = new Graphics()
        this.graphicsContainer = graphicsContainer;
        this.editor = editor;
        this.state = state;
    }

    render() {
        const element = this.state.element;
        const style = TextEditUtils.getTextStyle({
            wordWrapWidth: element.width,
            fontSize: element.fontSize,
            color: element.fillColor
        })
        const positionConverter = this.editor.positionConverter

        const startPoint = positionConverter.getCanvasPosition(element.position)
        const [width, height] = positionConverter.getCanvasSize(element.width, element.height)

        const context = new GraphicsContext()
            .rect(0, 0, width, height)
            .stroke({
                width: 1,
                color: "#0C8CE9"
            })

        if (this.state.selectedIndexs) {

            const localLinesPositions = TextEditUtils.getLinesLocalPositions(element.text, style, this.state.selectedIndexs.start, this.state.selectedIndexs.end)

            for (const { start, end } of localLinesPositions) {

                const height = element.fontSize

                const [canvasStartX, canvasStartY] = this.editor.positionConverter.getCanvasSize(start.x, start.y);
                const [canvasEndX, canvasEndY] = this.editor.positionConverter.getCanvasSize(end.x, end.y + height);

                const canvasWidth = canvasEndX - canvasStartX
                const canvasHeight = canvasEndY - canvasStartY

                context.rect(canvasStartX, canvasStartY, canvasWidth, canvasHeight)
                context.fill({
                    r: 12,
                    g: 140,
                    b: 233,
                    a: 0.4
                })
            }
        } else if (this.state.lineIndicatorIsShow) {

            const text = element.text;
            const localPosition = TextEditUtils.getIndexPointerLocalPosition(this.state.editIndex, text, style)

            if (localPosition) {
                const [
                    canvasWidth,
                    canvasHeight
                ] = positionConverter.getCanvasSize(localPosition.x + 1, localPosition.y);

                const [_, barHeight] = positionConverter.getCanvasSize(0, element.fontSize)

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

    onInit() {
        this.graphicsContainer.addChild(this.graphics)

    }

    onDestroy() {
        this.graphicsContainer.removeChild(this.graphics)
    }

}