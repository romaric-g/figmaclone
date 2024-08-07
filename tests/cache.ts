import { expect } from 'chai';
import { CacheAttach } from '../src/core/utils/cacheAttach';
import { TreeRect } from '../src/core/tree/treeRect';

describe('Cache tests', () => {

    it('checking drop', () => {
        const rectA = new TreeRect({ name: "A" })

        const cache = new CacheAttach<TreeRect>()

        cache.save(rectA.getId(), rectA)

        expect(cache.drop(rectA.getId())).equals(rectA)
        expect(cache.drop(rectA.getId())).equals(undefined)

    })

    it('checking drop not keeped', () => {

        const rectA = new TreeRect({ name: "A" })
        const rectB = new TreeRect({ name: "B" })
        const rectC = new TreeRect({ name: "C" })

        const cache = new CacheAttach<TreeRect>()

        cache.save(rectA.getId(), rectA)
        cache.save(rectB.getId(), rectB)
        cache.save(rectC.getId(), rectC)

        cache.keep(rectA.getId())

        const rects = cache.dropNotKeeped()

        expect(rects).to.deep.equals([rectB, rectC])

    });
});