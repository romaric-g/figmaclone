import { Container } from "pixi.js";
import { TreeComponent } from "../../tree/treeComponent";
import { TreeComponentVisitor } from "../../tree/treeComponentVisitor";
import { CachableRenderer } from "./cachableRenderer";
import { CacheAttach } from "../../utils/cacheAttach";
import { TreeContainer } from "../../tree/treeContainer";
import { TreeRect } from "../../tree/treeRect";
import { TreeText } from "../../tree/treeText";

export abstract class CachedRenderVisitor implements TreeComponentVisitor {

    protected cache = new CacheAttach<CachableRenderer>()
    protected graphicsContainer: Container;
    protected currentIndex: number;

    constructor(lastIndex: number, graphicsContainer: Container) {
        this.currentIndex = lastIndex;
        this.graphicsContainer = graphicsContainer;
    }

    protected nextIndex() {
        return this.currentIndex++;
    }

    protected restoreCache(component: TreeComponent, newInstance: () => CachableRenderer) {
        const cache = this.cache
        const id = component.getId()

        if (!id) {
            throw "les elements sans ID ne peuvent être rendu"
        }

        const renderer = cache.restore(id)

        if (renderer) {
            cache.keep(id)
            return renderer;
        } else {
            const newRenderer = newInstance()

            newRenderer.onInit()

            cache.save(id, newRenderer)
            cache.keep(id)

            return newRenderer;
        }
    }

    unkeepAll() {
        this.cache.unkeepAll()
    }

    destroyNotKeeped() {
        const rendrers = this.cache.dropNotKeeped()

        for (const renderer of rendrers) {
            renderer.onDestroy()
        }
    }

    abstract doForRect(rect: TreeRect): void

    abstract doForContainer(container: TreeContainer): void;

    abstract doForText(text: TreeText): void;
}