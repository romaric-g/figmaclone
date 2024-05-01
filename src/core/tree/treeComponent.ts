import { TreeComponentData } from "../../ui/subjects";
import { Editor } from "../editor";
import { TreeContainer } from "./treeContainer"


export abstract class TreeComponent<T extends TreeComponentData = TreeComponentData> {

    private currentContainerParent?: TreeContainer;
    private name: string;

    constructor(name: string) {
        this.name = name
    }

    setParentContainer(treeContainer: TreeContainer) {
        this.currentContainerParent = treeContainer
    }

    deleteParentContainer() {
        this.currentContainerParent = undefined;
    }

    getContainerParent() {
        return this.currentContainerParent;
    }

    render(zIndex: number): number {
        return zIndex
    }

    getName() {
        return this.name;
    }

    init() {

    }

    destroy() {

    }

    getIndexsChain(): number[] {
        if (this.currentContainerParent) {
            const childIndex = this.currentContainerParent.getIndexOfChild(this)

            if (childIndex == -1) {
                return []
            }

            return [
                ...this.currentContainerParent.getIndexsChain(),
                childIndex
            ]
        }

        return []
    }

    abstract toData(index: number): T

    abstract getCanvasCoveredRect(): { minX: number, minY: number, maxX: number, maxY: number } | undefined

}