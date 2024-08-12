import { Container } from "pixi.js";
import { TreeContainer } from "../../../tree/treeContainer";
import { TreeRect } from "../../../tree/treeRect";
import { TreeText } from "../../../tree/treeText";
import { CachedRenderVisitor } from "../cachedRenderVisitor";
import { BoxSelectionRenderer } from "./boxSelection";
import { Editor } from "../../../editor";
import { ContainerSelectionRenderer } from "./containerSelection";
import { TextBoxSelectionRenderer } from "./textBoxSelection";

export class SelectionRenderVisitor extends CachedRenderVisitor {

    private editor: Editor;

    constructor(lastIndex: number, graphicsContainer: Container, editor: Editor) {
        super(lastIndex, graphicsContainer)
        this.editor = editor;
    }

    isSingleSelected() {
        return this.editor.selectionManager.getSelectionModifier().getDepthComponents().length == 1;
    }

    isHidden() {
        const utils = this.editor.toolManager.utils;

        return utils.getMovableState() != undefined || utils.getTextEditingState() != undefined;
    }

    doForRect(rect: TreeRect): void {
        const newInstance = () => {
            return new BoxSelectionRenderer(
                rect,
                this.graphicsContainer,
                this.editor.positionConverter,
                this.isSingleSelected.bind(this),
                this.isHidden.bind(this)
            )
        }

        this.restoreCache(rect, newInstance).render(this.nextIndex())
    }

    doForText(text: TreeText): void {
        const newInstance = () => {
            return new TextBoxSelectionRenderer(
                text,
                this.graphicsContainer,
                this.editor.positionConverter,
                this.isSingleSelected.bind(this),
                this.isHidden.bind(this)
            )
        }

        this.restoreCache(text, newInstance).render(this.nextIndex())
    }

    doForContainer(container: TreeContainer): void {

        const newInstance = () => {
            return new ContainerSelectionRenderer(
                container,
                this.graphicsContainer,
                this.editor.positionConverter
            )
        }

        this.restoreCache(container, newInstance).render(this.nextIndex())

        for (const component of container.getComponents()) {
            component.accept(this)
        }
    }
}