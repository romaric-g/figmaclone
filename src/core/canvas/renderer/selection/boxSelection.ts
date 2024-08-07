import { Container, Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeBox } from "../../../tree/treeBox";
import { PositionConverter } from "../../conversion/PositionConverter";
import { CachableRenderer } from "../cachableRenderer";

export class BoxSelectionRenderer implements CachableRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;
    private element: TreeBox;

    private positionConverter: PositionConverter;
    private isSingleSelected: () => boolean;
    private isHidden: () => boolean


    constructor(
        element: TreeBox,
        graphicsContainer: Container,
        positionConverter: PositionConverter,
        isSingleSelected: () => boolean,
        isHideen: () => boolean
    ) {
        this.graphics = new Graphics()
        this.element = element;
        this.graphicsContainer = graphicsContainer;
        this.positionConverter = positionConverter;
        this.isSingleSelected = isSingleSelected;
        this.isHidden = isHideen;
    }

    render(zIndex: number) {

        let hidden = !this.element.isHover() && !this.element.isSelected()

        if (this.isHidden()) {
            hidden = true;
        }

        if (hidden) {
            this.graphics.context = new GraphicsContext();
            return
        }

        const startPoint = this.positionConverter.getCanvasPosition(new Point(this.element.x, this.element.y))
        const [width, height] = this.positionConverter.getCanvasSize(this.element.width, this.element.height)

        const commonContext = new GraphicsContext()
            .rect(0, 0, width, height)

        if (this.element.isSelected()) {
            const strokeStyle = {
                width: 2,
                color: "blue"
            }
            commonContext.stroke(strokeStyle)

            if (this.isSingleSelected()) {
                commonContext.rect(-4, -4, 8, 8).fill("white").stroke(strokeStyle)
                commonContext.rect(-4, height - 4, 8, 8).fill("white").stroke(strokeStyle)
                commonContext.rect(width - 4, -4, 8, 8).fill("white").stroke(strokeStyle)
                commonContext.rect(width - 4, height - 4, 8, 8).fill("white").stroke(strokeStyle)
            }
        }


        if (this.element.isHover() && !this.element.isSelected()) {
            commonContext
                .stroke({
                    width: 1,
                    color: "blue"
                })
        }

        this.graphics.zIndex = zIndex;
        this.graphics.context = commonContext;
        this.graphics.x = startPoint.x;
        this.graphics.y = startPoint.y;

    }

    onInit() {
        this.graphicsContainer.addChild(this.graphics)

    }

    onDestroy() {
        this.graphicsContainer.removeChild(this.graphics)
    }

    getContainer() {
        return this.graphics;
    }

}