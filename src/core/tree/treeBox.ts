import { Point } from "pixi.js";
import { TreeComponent } from "./treeComponent";
import { SelectionBoxRenderer } from "../canvas/renderer/selectionBox";
import { SquaredZone } from "../utils/squaredZone";

export interface TreeBoxProps {
    name: string,
    id?: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export abstract class TreeBox extends TreeComponent {
    private _movePositionOrigin?: Point;
    private _elementSelectionRenderer: SelectionBoxRenderer;


    protected _hover: boolean = false;
    protected _selected: boolean = false;

    private _x!: number;
    private _y!: number;
    private _width!: number;
    private _height!: number;

    constructor({ id, name, x, y, width, height }: TreeBoxProps) {
        super({
            name: name,
            id: id
        })
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this._elementSelectionRenderer = new SelectionBoxRenderer(this)

    }

    set x(value: number) {
        this._x = Math.round((value) * 100) / 100
    }

    get x() {
        return this._x
    }

    set y(value: number) {
        this._y = Math.round((value) * 100) / 100
    }

    get y() {
        return this._y
    }

    set width(value: number) {
        this._width = Math.round((value) * 100) / 100
    }

    get width() {
        return this._width
    }

    set height(value: number) {
        this._height = Math.round((value) * 100) / 100
    }

    get height() {
        return this._height
    }

    unfreezeOriginalPosition() {
        this._movePositionOrigin = undefined;
    }

    getOriginalPosition() {
        if (this._movePositionOrigin) {
            return this._movePositionOrigin;
        }
        return new Point(this.x, this.y)
    }

    freezeOriginalPosition() {
        this._movePositionOrigin = new Point(this.x, this.y);
    }

    getSquaredZone(): SquaredZone {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.width,
            maxY: this.y + this.height
        }
    }

    getSquaredZoneFromOrigin(): SquaredZone {
        const x = this.getOriginalPosition().x;
        const y = this.getOriginalPosition().y;

        return {
            minX: x,
            minY: y,
            maxX: x + this.width,
            maxY: y + this.height
        }
    }

    isSelected() {
        return this._selected;
    }

    isHover() {
        return this._hover;
    }

    setHover(value: boolean) {
        this._hover = value;
    }

    render(zIndex: number) {
        this._elementSelectionRenderer.render(zIndex)

        return zIndex + 1;
    }


    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }


    onSelectionInit() {
        this._selected = true;
    }

    onSelectionDestroy() {
        this._selected = false;
        this._hover = false;
    }

    init(resetId: boolean = true) {
        super.init(resetId)

        this._elementSelectionRenderer.init()
    }

    destroy(): void {
        super.destroy()

        this._elementSelectionRenderer.destroy()
    }
}