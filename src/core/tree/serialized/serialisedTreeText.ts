import { HsvaColor } from "@uiw/react-color";
import { TreeText } from "../treeText";
import { SerialisedTreeComponent } from "./serialisedTreeComponent";


interface Props {
    name: string,
    id?: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: HsvaColor
}

export class SerialisedTreeText extends SerialisedTreeComponent<Props> {
    deserialize(): TreeText {
        const newRect = new TreeText({
            name: this.props.name,
            id: this.props.id,
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            fillColor: this.props.fillColor
        })

        return newRect;
    }
}