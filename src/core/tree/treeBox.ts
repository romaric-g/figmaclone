import { Point } from "pixi.js";
import { TreeComponent } from "./treeComponent";
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

    get position() {
        return new Point(this.x, this.y)
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
            maxX: Math.round((this.x + this.width) * 100) / 100,
            maxY: Math.round((this.y + this.height) * 100) / 100
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

    destroy(): void {
        super.destroy()
    }
}