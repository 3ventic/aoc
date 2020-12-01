import input from "./input";

interface INode {
	sum: number;
	value: number;
}

function calculateNode(inArr: number[]): INode {
	const children: number = inArr.splice(0, 1)[0];
	const entries: number = inArr.splice(0, 1)[0];
	let sum: number = 0;
	let values: number[] = [0];
	for (let c: number = children; c > 0; c--) {
		let childNode: INode = calculateNode(inArr);
		sum += childNode.sum;
		values.push(childNode.value);
	}
	let metadata: number[] = inArr.splice(0, entries);
	sum += metadata.reduce((r, v) => r + v, 0);

	// no children, value equal to sum of metadata
	if (children === 0) {
		return { sum, value: sum };
	}

	// has children, value equal to sum of children's values, as indexed by metadata entries
	let value: number = 0;
	for (let i: number = 0; i < entries; i++) {
		let m: number = metadata[i];
		if (values[m]) {
			value += values[m];
		}
	}
	return { sum, value };
}

let rootNode: INode = calculateNode(input);
console.log("Part 1 answer:", rootNode.sum);
console.log("Part 2 answer:", rootNode.value);
