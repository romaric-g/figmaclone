import { TreeComponentData } from "../../ui/subjects";
import { SerialisedTreeComponent } from "../tree/serialized/serialisedTreeComponent";


export class Snapshot {

    readonly selectedIds: string[];
    readonly treeComponents: SerialisedTreeComponent[]

    constructor(selectedIds: string[], treeComponents: SerialisedTreeComponent[]) {
        this.selectedIds = selectedIds;
        this.treeComponents = treeComponents;
    }


}