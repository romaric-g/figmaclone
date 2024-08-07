import { Application, ApplicationOptions, Container } from "pixi.js";
import { Editor } from "../editor";
import { BackgroundLayer } from "./layers/background";
import { TreeLayer } from "./layers/tree";
import { SelectionLayer } from "./layers/selection";
import { TreeRenderVisitor } from "./renderer/tree/treeRenderVisitor";
import { SelectionRenderVisitor } from "./renderer/selection/selectionRenderVisitor";
import { DragSelectionBoxRenderer } from "./renderer/dragSelectorBox";
import { StickyInfo, StickyPointsRenderer } from "./renderer/stickyPoints";
import { getSquaredCoveredZone } from "../utils/squaredZone";
import { GlobalSelectionBoxRenderer } from "./renderer/globalSelectionBox";
import { TextEditRenderer } from "./renderer/selection/textEdit";
import { TextRenderer } from "./renderer/tree/textRenderer";

export class CanvasManager {
    private _editor: Editor;
    private _app: Application;

    private _backgroundLayer: BackgroundLayer;
    private _treeLayer: TreeLayer;
    private _selectionLayer: SelectionLayer;

    private treeRenderVistor: TreeRenderVisitor;
    private selectionRenderVisitor: SelectionRenderVisitor;
    private dragSelectionBoxRenderer: DragSelectionBoxRenderer;
    private stickyPointRenderer: StickyPointsRenderer;
    private globalSelectionBoxRenderer: GlobalSelectionBoxRenderer;
    private textEditRenderer?: TextEditRenderer;

    constructor(editor: Editor) {
        this._editor = editor;
        this._app = new Application()

        this._backgroundLayer = new BackgroundLayer(this)
        this._treeLayer = new TreeLayer(this)
        this._selectionLayer = new SelectionLayer(this)

        const treeContainer = this._treeLayer.getContainer()
        const selectionContainer = this._selectionLayer.getContainer()

        this.treeRenderVistor = new TreeRenderVisitor(0, treeContainer, editor)

        this.selectionRenderVisitor = new SelectionRenderVisitor(0, selectionContainer, editor)
        this.dragSelectionBoxRenderer = new DragSelectionBoxRenderer(selectionContainer)
        this.stickyPointRenderer = new StickyPointsRenderer(selectionContainer, editor)
        this.globalSelectionBoxRenderer = new GlobalSelectionBoxRenderer(selectionContainer)
    }

    async init(options?: Partial<ApplicationOptions>) {
        await this._app.init(options)

        this._backgroundLayer.init()
        this._treeLayer.init()
        this._selectionLayer.init()

        this._app.stage.addChild(this._backgroundLayer.getContainer())
        this._app.stage.addChild(this._treeLayer.getContainer())
        this._app.stage.addChild(this._selectionLayer.getContainer())

        this.dragSelectionBoxRenderer.init()
        this.stickyPointRenderer.init()
        this.globalSelectionBoxRenderer.init()

        this._app.ticker.maxFPS = 90
        this._app.ticker.add(() => {
            this.render()

        });
    }

    render() {
        this._treeLayer.getContainer().x = this.getEditor().zoom.getX()
        this._treeLayer.getContainer().y = this.getEditor().zoom.getY()
        this._treeLayer.getContainer().scale = this.getEditor().zoom.getCurrentScale()

        this._backgroundLayer.render()

        const rootContainer = this._editor.treeManager.getTree();

        // Rendu des composents
        this.treeRenderVistor.unkeepAll()
        this.treeRenderVistor.doForContainer(rootContainer)
        this.treeRenderVistor.destroyNotKeeped()

        // Rendu des habillages de composent
        this.selectionRenderVisitor.unkeepAll()
        this.selectionRenderVisitor.doForContainer(rootContainer)
        this.selectionRenderVisitor.destroyNotKeeped()

        // Rendu de l'effet Drag
        const dragSelectionState = this._editor.toolManager.utils.getDragState()
        this.dragSelectionBoxRenderer.render(dragSelectionState)


        // Rendu des points sticky 
        const drawTool = this._editor.toolManager.utils.getDrawTool()
        const reshapeState = this._editor.toolManager.utils.getReshapeState()
        const movableState = this._editor.toolManager.utils.getMovableState()

        const boxs = this._editor.treeManager.getAllBoxComponents()
        const selectedBoxs = this._editor.selectionManager.getSelectionModifier().getAllBoxComponents()

        const otherZones = boxs.filter((r) => !selectedBoxs.includes(r)).map(r => r.getSquaredZone())
        const selectionZone = getSquaredCoveredZone(selectedBoxs.map(c => c.getSquaredZone()))


        if (drawTool) {
            const stickyInfo = drawTool.getStickyInfo()

            this.stickyPointRenderer.render(stickyInfo, selectionZone, otherZones)
        } else if (reshapeState) {
            const stickyInfo = reshapeState.getStickyInfo()

            this.stickyPointRenderer.render(stickyInfo, selectionZone, otherZones)
        } else if (movableState) {
            const stickyInfo: StickyInfo = {
                top: true,
                bottom: true,
                left: true,
                right: true
            }

            this.stickyPointRenderer.render(stickyInfo, selectionZone, otherZones, true)
        } else {
            this.stickyPointRenderer.render(undefined, selectionZone, otherZones)
        }


        // Rendu global selection
        this.globalSelectionBoxRenderer.render()

        // Rendu de la vue de text editing

        const textEditingState = this._editor.toolManager.utils.getTextEditingState()
        const textComponent = textEditingState?.getTextComponent()

        if (textComponent) {
            if (!this.textEditRenderer) {
                const selectionContainer = this._selectionLayer.getContainer()
                this.textEditRenderer = new TextEditRenderer(selectionContainer, Editor.getEditor(), textComponent)
                this.textEditRenderer.onInit()
            }
            this.textEditRenderer.render()
        } else {
            if (this.textEditRenderer) {
                this.textEditRenderer.onDestroy()
                this.textEditRenderer = undefined;
            }
        }
    }

    getTreeLayer() {
        return this._treeLayer;
    }

    getBackgroundLayer() {
        return this._backgroundLayer;
    }

    getSelectionLayer() {
        return this._selectionLayer;
    }

    getTreeContainer(): Container {
        return this._treeLayer.getContainer()
    }

    getBackgroundContainer(): Container {
        return this._backgroundLayer.getContainer()
    }

    getCanvas() {
        return this._app.canvas;
    }

    getEditor() {
        return this._editor;
    }

}