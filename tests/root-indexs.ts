import { expect } from 'chai';
import { Anchor } from '../src/core/tree/anchors/anchor';
import { AnchorContainer } from '../src/core/tree/anchors/anchorContainer';

describe('Root indexs tests', () => {
    it('checking parent index', () => {
        const anchorContainer = new AnchorContainer<string>("Container")

        const anchorA = new Anchor<string>("A")
        const anchorB = new Anchor<string>("B")
        const anchorC = new Anchor<string>("C")

        anchorContainer.add(anchorA)
        anchorContainer.add(anchorB)
        anchorContainer.add(anchorC)

        expect(anchorC.getParentIndex()).equal(2)

    })
    it('checking good retrieves', () => {

        const anchorA = new Anchor<string>("A")
        const anchorB = new Anchor<string>("B")
        const anchorC = new Anchor<string>("C")

        const anchorContainerD = new AnchorContainer<string>("D")
        const anchorContainerE = new AnchorContainer<string>("E")
        const anchorContainerF = new AnchorContainer<string>("F")

        anchorContainerF.add(anchorContainerE)
        anchorContainerF.add(anchorA)

        anchorContainerE.add(anchorB)
        anchorContainerE.add(anchorContainerD)

        anchorContainerD.add(anchorC)

        expect(anchorC.getAnchorContainer()).not.undefined;
        expect(anchorC.getAnchorContainer()).equal(anchorContainerD)
        expect(anchorC.getRootIndexs()).to.deep.eq([0, 1, 0]);
    });
});