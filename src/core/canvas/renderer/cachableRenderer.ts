
export interface CachableRenderer {

    onInit(): void

    onDestroy(): void

    render(zIndex: number): void

}