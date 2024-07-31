import { TreeContainer } from "./treeContainer"
import { TreeComponent } from "./treeComponent"
import { TreeComponentData } from "../../ui/subjects";
import { SerialisedTreeRect } from "./serialized/serialisedTreeRect";
import { TreeBox } from "./treeBox";

console.log("TreeBox of OTHER", TreeBox)

export class TreeOther extends TreeBox {

    toData(index: number): TreeComponentData {
        return {
            type: "rect",
            index: index,
            name: this.getName(),
            selected: this.isSelected()
        }
    }



    serialize(): SerialisedTreeRect {
        console.log("coucou")
        throw "not implemented"
    }

}