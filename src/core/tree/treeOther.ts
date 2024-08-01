import { TreeBox } from "./treeBox";
import { TreeComponentData } from "../../ui/subjects";
import { SerialisedTreeOther } from "./serialized/serialisedTreeOther";

export class TreeOther extends TreeBox {

    toData(index: number): TreeComponentData {
        return {
            type: "rect",
            index: index,
            name: this.getName(),
            selected: this.isSelected()
        }
    }

    serialize(): SerialisedTreeOther {
        console.log("coucou")

        return {
            type: "other",
            props: {
                name: this.getName(),
                id: this.getId(),
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            }
        }
    }

}