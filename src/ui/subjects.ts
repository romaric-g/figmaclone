import { Subject } from 'rxjs';
import { HsvaColor } from '@uiw/react-color';


export type ToolType = "select" | "rect" | "text"

export const treeElementSubject = new Subject<TreeData>();
export const currentToolSubject = new Subject<ToolType>();
export const selectionChangeSubject = new Subject<SelectionData | undefined>();
export const cursorChangeSubject = new Subject<string>()
export const contextMenuChangeSubject = new Subject<ContextMenuData>()


export interface TreeData {
    tree: TreeComponentData[]
}

export type TreeComponentData = TreeRectData | TreeTextData | TreeContainerData

export interface TreeComponentBaseData<T extends string> {
    type: T,
    index: number,
    name: string
    selected: boolean
}

export type TreeRectData = TreeComponentBaseData<"rect">

export type TreeTextData = TreeComponentBaseData<"text">

export interface TreeContainerData extends TreeComponentBaseData<"container"> {
    children: TreeComponentData[]
}

export interface SelectionData {
    lenght: number
    x: number | "mixed" | undefined,
    y: number | "mixed" | undefined,
    width: number | "mixed" | undefined,
    height: number | "mixed" | undefined,
    color: HsvaColor | "mixed" | undefined,
    borderColor: HsvaColor | "mixed" | undefined,
    borderWidth: number | "mixed" | undefined,
    fontSize: number | "mixed" | undefined
}

export interface MenuItemData {
    label: string,
    command?: string,
    onClick: () => void
}


export interface ContextMenuData {
    x: number;
    y: number;
    items: MenuItemData[];
}
