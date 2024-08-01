import { expect } from 'chai';
import { getSquaredCoveredZone, SquaredZone } from '../src/core/utils/squaredZone';

describe('Options tests', () => { // the tests container
    it('checking default options', () => { // the single test

        const zoneA: SquaredZone = {
            minX: 0,
            maxX: 100,
            minY: 0,
            maxY: 100
        }

        const zoneB: SquaredZone = {
            minX: 200,
            maxX: 300,
            minY: -100,
            maxY: 400
        }

        const coveredZone = getSquaredCoveredZone([zoneA, zoneB])

        if (coveredZone) {
            expect(coveredZone.minX).to.equal(0);
            expect(coveredZone.minY).to.equal(-100);
            expect(coveredZone.maxX).to.equal(300);
            expect(coveredZone.maxY).to.equal(400);
        } else {
            expect(coveredZone).to.not.be.undefined;
        }

    });
});