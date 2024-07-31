import { TreeComponentData } from "../../ui/subjects";
import { SerialisedTreeComponent } from "./serialized/serialisedTreeComponent";
import { TreeContainer } from "./treeContainer"
import { v4 as uuidv4 } from 'uuid';


export interface TreeComponentProps {
    name: string,
    id?: string
}

export abstract class TreeComponent {

    private currentContainerParent?: TreeContainer;
    private _name: string;
    private _id?: string;
    private _initialised = false;

    constructor({ name, id }: TreeComponentProps) {
        this._name = name;
        this._id = id;
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
        return this._name;
    }


    isInit() {
        return this._initialised;
    }

    init(resetId: boolean = true) {
        if (!this._initialised) {
            this._initialised = true;
            if (resetId || !this._id) {
                this._id = uuidv4();
            }
        }

    }

    destroy() {
        if (this.isInit()) {
            this._initialised = false;
            const parent = this.getParentContainer()

            if (parent) {
                parent.remove(this)
            }
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

    abstract toData(index: number): TreeComponentData

    abstract getCanvasCoveredRect(): { minX: number, minY: number, maxX: number, maxY: number } | undefined

}