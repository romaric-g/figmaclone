import { ContextMenuData } from "../../ui/subjects";
import { MenuItem } from "./menuItem";


export class Menu {

    private x: number;
    private y: number;
    private items: MenuItem[] = []

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    addItem(item: MenuItem) {
        this.items.push(item)
    }

    toData(): ContextMenuData {
        return {
            x: this.x,
            y: this.y,
            items: this.items.map((item) => ({
                label: item.name,
                command: item.key,
                onClick: () => {
                    item.apply()
                }
            }))
        }
    }


}