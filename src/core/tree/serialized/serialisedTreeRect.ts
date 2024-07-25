import { HsvaColor } from "@uiw/react-color";
import { SerialisedTreeComponent } from "./serialisedTreeComponent";
import { TreeRect } from "../treeRect";


interface Props {
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

export class SerialisedTreeRect extends SerialisedTreeComponent<Props> {
    deserialize(): TreeRect {
        return TreeRect.deserialize(this)
    }
}