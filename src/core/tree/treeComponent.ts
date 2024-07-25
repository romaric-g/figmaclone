import { TreeComponentData } from "../../ui/subjects";
import { SerialisedTreeComponent } from "./serialized/serialisedTreeComponent";
import { TreeContainer } from "./treeContainer"
import { v4 as uuidv4 } from 'uuid';


export abstract class TreeComponent<T extends TreeComponentData = TreeComponentData> {

    private currentContainerParent?: TreeContainer;
    private name: string;
    protected _id?: string;

    constructor(name: string) {
        this.name = name
    }

    updateParentContainerCache(treeContainer?: TreeContainer) {
        this.currentContainerParent = treeContainer
    }

    getParentContainer() {
        return this.currentContainerParent;
    }

    render(zIndex: number): number {
        return zIndex
    }

    getName() {
        return this.name;
    }

    init(resetId: boolean = true) {
        if (resetId || !this._id) {
            this._id = uuidv4();
        }
    }

    destroy() {
        const parent = this.getParentContainer()

        if (parent) {
            parent.remove(this)
        }
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

    getId() {
        return this._id;
    }

    abstract serialize(): SerialisedTreeComponent

    abstract toData(index: number): T

    abstract getCanvasCoveredRect(): { minX: number, minY: number, maxX: number, maxY: number } | undefined

}