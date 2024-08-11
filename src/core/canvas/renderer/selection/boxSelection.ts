import { Container, Graphics, GraphicsContext, Point } from "pixi.js";
import { TreeBox } from "../../../tree/treeBox";
import { PositionConverter } from "../../conversion/PositionConverter";
import { CachableRenderer } from "../cachableRenderer";

export class BoxSelectionRenderer implements CachableRenderer {

    private graphicsContainer: Container;
    private graphics: Graphics;
    readonly element: TreeBox;

    protected positionConverter: PositionConverter;
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


        if (this.element.isSelected()) {
            this.applySelectEffect(commonContext, width, height)
        } else if (this.element.isHover()) {
            this.applyHoverEffect(commonContext, width, height)
        }

        this.graphics.zIndex = zIndex;
        this.graphics.context = commonContext;
        this.graphics.x = startPoint.x;
        this.graphics.y = startPoint.y;

    }

    applySelectEffect(context: GraphicsContext, width: number, height: number) {
        const strokeStyle = {
            width: 2,
            color: "#0C8CE9"
        }
        context.rect(0, 0, width, height)
        context.stroke(strokeStyle)

        if (this.isSingleSelected()) {
            context.rect(-4, -4, 8, 8).fill("white").stroke(strokeStyle)
            context.rect(-4, height - 4, 8, 8).fill("white").stroke(strokeStyle)
            context.rect(width - 4, -4, 8, 8).fill("white").stroke(strokeStyle)
            context.rect(width - 4, height - 4, 8, 8).fill("white").stroke(strokeStyle)
        }
    }

    applyHoverEffect(context: GraphicsContext, width: number, height: number) {
        context.rect(0, 0, width, height)
        context
            .stroke({
                width: 1,
                color: "#0C8CE9"
            })
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