import { SerialisedTreeComponent } from "./serialized/serialisedTreeComponent";
import { Anchor } from "./anchors/anchor";
import { v4 as uuidv4 } from 'uuid';
import { TreeComponentData } from "../../ui/subjects";
import { SquaredZone } from "../utils/squaredZone";
import { TreeComponentVisitor } from "./treeComponentVisitor";

export interface TreeComponentProps {
    name: string,
    id?: string
}

export abstract class TreeComponent {

    private _anchor: Anchor<TreeComponent>;
    private _name: string;
    private _id: string;

    constructor({ name, id }: TreeComponentProps) {
        this._name = name;
        this._id = id || uuidv4();
        this._anchor = new Anchor(this)

    }

    resetId() {
        this._id = uuidv4()
    }

    getName() {
        return this._name;
    }

    destroy() {
        this.getAnchor().getAnchorContainer()?.remove(this.getAnchor())
    }

    getAnchor(): Anchor<TreeComponent> {
        return this._anchor;
    }

    getId() {
        return this._id;
    }


    abstract serialize(): SerialisedTreeComponent

    abstract toData(index: number): TreeComponentData

    abstract getSquaredZone(): SquaredZone | undefined

    abstract accept(visitor: TreeComponentVisitor): void;


}

