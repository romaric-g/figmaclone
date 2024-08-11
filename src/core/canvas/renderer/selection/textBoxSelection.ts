import { Container, GraphicsContext } from "pixi.js";
import { BoxSelectionRenderer } from "./boxSelection";
import { TreeText } from "../../../tree/treeText";
import { PositionConverter } from "../../conversion/PositionConverter";
import { TextEditUtils } from "../../../utils/textEditUtils";


export class TextBoxSelectionRenderer extends BoxSelectionRenderer {

    readonly element: TreeText;

    constructor(
        element: TreeText,
        graphicsContainer: Container,
        positionConverter: PositionConverter,
        isSingleSelected: () => boolean,
        isHideen: () => boolean
    ) {
        super(
            element,
            graphicsContainer,
            positionConverter,
            isSingleSelected,
            isHideen
        )

        this.element = element;
    }

    applySelectEffect(context: GraphicsContext, width: number, height: number): void {
        super.applySelectEffect(context, width, height)
        this.applyHoverEffect(context, width, height)
    }

    applyHoverEffect(context: GraphicsContext, width: number, height: number) {

        const text = this.element.text;
        const style = TextEditUtils.getTextStyle({
            wordWrapWidth: this.element.width,
            fontSize: this.element.fontSize,
            color: this.element.fillColor
        })

        const localLinesPositions = TextEditUtils.getLinesLocalPositions(text, style)

        for (const { start, end } of localLinesPositions) {

            const height = this.element.fontSize

            const [canvasStartX, canvasStartY] = this.positionConverter.getCanvasSize(start.x, start.y + height)
            const [canvasEndX, canvasEndY] = this.positionConverter.getCanvasSize(end.x, end.y + height)

            context
                .moveTo(canvasStartX, canvasStartY)
                .lineTo(canvasEndX, canvasEndY)
                .stroke({
                    width: 1,
                    a: 1,
                    color: "#0C8CE9"
                })
        }
    }

}