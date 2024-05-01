
export function findMinimumDifference(list1: any[], list2: any[]): [number, number, number] {
    if (list1.length === 0 || list2.length === 0) {
        throw new Error("Les listes ne doivent pas être vides.");
    }

    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let minDiff = Math.abs(list1[0] - list2[0]);
    let minIndex1 = 0;
    let minIndex2 = 0;

    let i = 0;
    let j = 0;
    while (i < list1.length && j < list2.length) {
        const diff = Math.abs(list1[i] - list2[j]);
        if (diff < minDiff) {
            minDiff = diff;
            minIndex1 = i;
            minIndex2 = j;
        }
        if (list1[i] < list2[j]) {
            i++;
        } else {
            j++;
        }
    }

    return [list1[minIndex1], list2[minIndex2], minDiff];
}
