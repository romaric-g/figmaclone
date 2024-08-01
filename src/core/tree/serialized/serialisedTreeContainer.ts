import { SerialisedTreeComponent } from "./serialisedTreeComponent";

export interface SerialisedTreeContainer extends SerialisedTreeComponent {
    type: "container",
    props: {
        name: string,
        id?: string,
        components: SerialisedTreeComponent[]
    }
}
