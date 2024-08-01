import { SerialisedTreeComponent } from "./serialized/serialisedTreeComponent";
import { Anchor } from "./anchors/anchor";
import { v4 as uuidv4 } from 'uuid';
import { TreeComponentData } from "../../ui/subjects";
import { SquaredZone } from "../utils/squaredZone";

export interface TreeComponentProps {
    name: string,
    id?: string
}

export abstract class TreeComponent {

    private _anchor: Anchor<TreeComponent>;
    private _name: string;
    private _id?: string;
    private _initialised = false;

    constructor({ name, id }: TreeComponentProps) {
        this._name = name;
        this._id = id;
        this._anchor = new Anchor(this)

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
            this.getAnchor().getAnchorContainer()?.remove(this.getAnchor())
        }
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


}

