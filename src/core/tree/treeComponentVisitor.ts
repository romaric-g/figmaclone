import { TreeContainer } from "./treeContainer";
import { TreeRect } from "./treeRect";
import { TreeText } from "./treeText";


export interface TreeComponentVisitor {
    doForRect(rect: TreeRect): void;
    doForContainer(container: TreeContainer): void;
    doForText(text: TreeText): void;
}