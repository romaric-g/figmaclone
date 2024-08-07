import { TreeContainer } from "../../../tree/treeContainer";
import { TreeRect } from "../../../tree/treeRect";
import { TreeText } from "../../../tree/treeText";
import { RectRenderer } from "./rectRenderer";
import { CachedRenderVisitor } from "../cachedRenderVisitor";
import { Container } from "pixi.js";
import { Editor } from "../../../editor";
import { TextRenderer } from "./textRenderer";

export class TreeRenderVisitor extends CachedRenderVisitor {

    protected editor: Editor;

    constructor(lastIndex: number, graphicsContainer: Container, editor: Editor) {
        super(lastIndex, graphicsContainer)
        this.editor = editor;
    }

    doForRect(rect: TreeRect): void {
        const newInstance = () => {
            return new RectRenderer(rect, this.graphicsContainer, this.editor.eventsManager)
        }

        this.restoreCache(rect, newInstance).render(this.nextIndex())
    }

    doForText(text: TreeText): void {
        const newInstance = () => {
            return new TextRenderer(text, this.graphicsContainer, this.editor.eventsManager)
        }

        this.restoreCache(text, newInstance).render(this.nextIndex())
    }

    doForContainer(container: TreeContainer): void {

        console.log("components")
        console.log(container.getComponents())

        for (const component of container.getComponents()) {
            component.accept(this)
        }
    }
}