import { TreeContainer } from "../treeContainer";
import { SerialisedTreeComponent } from "./serialisedTreeComponent";


interface Props {
    name: string,
    id?: string,
    components: SerialisedTreeComponent[]
}

export class SerialisedTreeContainer extends SerialisedTreeComponent<Props> {

    deserialize(): TreeContainer {
        return TreeContainer.deserialize(this)
    }

}