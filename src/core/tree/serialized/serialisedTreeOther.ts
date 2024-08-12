import { SerialisedTreeComponent } from "./serialisedTreeComponent";

export interface SerialisedTreeOther extends SerialisedTreeComponent {
    type: "other",
    props: {
        name: string,
        id?: string,
        x: number,
        y: number,
        width: number,
        height: number
    }
}