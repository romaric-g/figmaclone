import { TreeComponent } from "../treeComponent";

interface Props {
    name: string;
    id?: string;
}

export abstract class SerialisedTreeComponent<T extends Props = Props, O extends TreeComponent = TreeComponent> {
    readonly props: T;

    constructor(props: T) {
        this.props = props;
    }

    abstract deserialize(): O
}