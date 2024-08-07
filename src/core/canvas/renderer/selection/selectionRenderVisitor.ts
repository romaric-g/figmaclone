import { Container } from "pixi.js";
import { TreeBox } from "../../../tree/treeBox";
import { TreeContainer } from "../../../tree/treeContainer";
import { TreeRect } from "../../../tree/treeRect";
import { TreeText } from "../../../tree/treeText";
import { CachedRenderVisitor } from "../cachedRenderVisitor";
import { BoxSelectionRenderer } from "./boxSelection";
import { Editor } from "../../../editor";
import { SelectTool } from "../../../tools/selectTool";
import { MovableSelectionState } from "../../../tools/selectStates/movableSelection";
import { ContainerSelectionRenderer } from "./containerSelection";

export class SelectionRenderVisitor extends CachedRenderVisitor {

    private editor: Editor;

    constructor(lastIndex: number, graphicsContainer: Container, editor: Editor) {
        super(lastIndex, graphicsContainer)
        this.editor = editor;
    }

    doForBox(box: TreeBox) {
        const isSingleSelected = () => {
            return this.editor.selectionManager.getSelectionModifier().getDepthComponents().length == 1;
        }

        const isHidden = () => {

            const utils = this.editor.toolManager.utils;

            return utils.getMovableState() != undefined || utils.getTextEditingState() != undefined;
        }

        const newInstance = () => {
            return new BoxSelectionRenderer(
                box,
                this.graphicsContainer,
                this.editor.positionConverter,
                isSingleSelected,
                isHidden
            )
        }

        this.restoreCache(box, newInstance).render(this.nextIndex())
    }

    doForRect(rect: TreeRect): void {
        this.doForBox(rect)
    }

    doForText(text: TreeText): void {
        this.doForBox(text)
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