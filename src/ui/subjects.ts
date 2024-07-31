import { Subject } from 'rxjs';
import { ToolType } from '../core/tools/toolManager';
import { HsvaColor } from '@uiw/react-color';

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
    x: number | "mixed",
    y: number | "mixed",
    width: number | "mixed",
    height: number | "mixed",
    color: HsvaColor | "mixed",
    borderColor: HsvaColor | "mixed",
    borderWidth: number | "mixed"
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
