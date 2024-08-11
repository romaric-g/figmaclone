
import { expect } from 'chai';
import { getFullLines, sliceFullLines } from '../src/core/utils/textEditUtils';

describe('Text renderer tests', () => {

    it('checking full line getting', () => {

        const text = "Bonjour à tous et à toutes   \n   Aujourdhui,  J'aimerais infiniment remercier le maire pour son accueil"

        // Contenu retourné par CanvasTextMetrics.measureText pour une taille de boite définie
        const lines = [
            "Bonjour à tous et à",
            "toutes",
            "   Aujourdhui,  J'aimerais",
            "infiniment remercier le",
            "maire pour son accueil"
        ]

        const fullLine = getFullLines(text, lines)

        expect(fullLine).to.deep.equal([
            "Bonjour à tous et à ",
            "toutes   \n",
            "   Aujourdhui,  J'aimerais ",
            "infiniment remercier le ",
            "maire pour son accueil"
        ])

        expect(fullLine.join("").length).equals(text.length)

    })

    it('end with slash N', () => {

        const text = "Bonjour à tous\n"
        const lines = [
            "Bonjour à",
            "tous",
            ""
        ]

        const fullLine = getFullLines(text, lines)

        expect(fullLine).to.deep.equal([
            "Bonjour à ",
            "tous\n",
            ""
        ])

        const text2 = "Bonjour à tous\n\n\n"
        const lines2 = [
            "Bonjour à",
            "tous",
            "",
            "",
            ""
        ]

        const fullLine2 = getFullLines(text2, lines2)

        expect(fullLine2).to.deep.equal([
            "Bonjour à ",
            "tous\n",
            "\n",
            "\n",
            ""
        ])


        const text3 = "Bonjour à tous \n    \n  Comment ça va ?  \n   "
        const lines3 = [
            "Bonjour à",
            "tous",
            "",
            "  Comment",
            "ça va ?",
            ""
        ]

        const fullLine3 = getFullLines(text3, lines3)

        expect(fullLine3).to.deep.equal([
            "Bonjour à ",
            "tous \n",
            "    \n",
            "  Comment ",
            "ça va ?  \n",
            "   "
        ])

        expect(fullLine3.join("").length).equals(text3.length)

        const text4 = "Bonjour à\ntou\ne\ne\ne"
        const lines4 = [
            'Bonjour à',
            'tou',
            'e',
            'e',
            'e'
        ]

        const fullLine4 = getFullLines(text4, lines4)

        expect(fullLine4).to.deep.equal([
            "Bonjour à\n",
            "tou\n",
            "e\n",
            "e\n",
            "e"
        ])
    })

    it('end with space break', () => {

        const text = "Bonjour à tous et bienvenue   "
        const lines = [
            'Bonjour à',
            'tous et',
            'bienvenue',
            '',
        ]

        const fullLine = getFullLines(text, lines)

        expect(fullLine).to.deep.equal([
            "Bonjour à ",
            "tous et ",
            "bienvenue   ",
            ""
        ])


        const text2 = "Bonjour à tous\n                              Hi"
        const lines2 = [
            "Bonjour à tous",
            "",
            "Hi"
        ]

        const fullLine2 = getFullLines(text2, lines2)

        expect(fullLine2).to.deep.equal([
            "Bonjour à tous\n",
            "                              ",
            "Hi"
        ])



        const text3 = "Bonjour à tous et r e"
        const lines3 = [
            "Bonjour à tous et r",
            "e"
        ]

        const fullLine3 = getFullLines(text3, lines3)

        expect(fullLine3).to.deep.equal([
            "Bonjour à tous et r ",
            "e"
        ])

    })


    it('slice full lines', () => {

        const fullLines = [
            'Bonjour à ',
            'tous\n',
            'Vous êtes les ',
            'bienvenue !',
            '  ->  \n',
            ''
        ]

        const slicedFullLines = sliceFullLines(fullLines, 14)

        expect(slicedFullLines).to.deep.equal([
            'Bonjour à ',
            'tous'
        ])


        const slicedFullLines2 = sliceFullLines(fullLines, 22)

        expect(slicedFullLines2).to.deep.equal([
            'Bonjour à ',
            'tous\n',
            'Vous êt'
        ])
    })

});