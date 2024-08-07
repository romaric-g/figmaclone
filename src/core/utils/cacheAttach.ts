
export class CacheAttach<T> {

    private componentsMap: { [id: string]: T } = {}
    private keepedIds: string[] = []

    save(id: string, t: T) {
        this.componentsMap[id] = t;
    }

    restore(id: string) {
        if (this.componentsMap.hasOwnProperty(id)) {
            return this.componentsMap[id]
        }
        return undefined;
    }

    drop(id: string) {
        if (this.componentsMap.hasOwnProperty(id)) {
            const renderer = this.componentsMap[id]
            delete this.componentsMap[id]

            return renderer
        }
        return undefined
    }

    keep(id: string) {
        this.keepedIds.push(id)
    }

    unkeepAll() {
        this.keepedIds = []
    }

    dropNotKeeped() {
        const ts: T[] = []

        for (const id of Object.keys(this.componentsMap)) {
            if (!this.keepedIds.includes(id)) {
                const t = this.drop(id)
                if (t) {
                    ts.push(t)
                }
            }
        }
        return ts;
    }

}