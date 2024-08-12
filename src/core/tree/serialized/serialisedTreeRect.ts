import { HsvaColor } from "@uiw/react-color";
import { SerialisedTreeComponent } from "./serialisedTreeComponent";

export interface SerialisedTreeRect extends SerialisedTreeComponent {
    type: "rect",
    props: {
        name: string,
        id?: string,
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: HsvaColor,
        borderColor: HsvaColor,
        borderWidth?: number
    }
}