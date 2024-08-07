import { HsvaColor } from "@uiw/react-color";
import { SerialisedTreeComponent } from "./serialisedTreeComponent";

export interface SerialisedTreeText extends SerialisedTreeComponent {
    type: "text",
    props: {
        name: string,
        text: string,
        id?: string,
        x: number,
        y: number,
        width: number,
        height: number,
        fillColor: HsvaColor
    }
}