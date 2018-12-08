import input from "./input";

function sumMetadata(inArr: number[]): number {
	let children: number = inArr.splice(0, 1)[0];
	const entries: number = inArr.splice(0, 1)[0];
	let sum: number = 0;
	for (let c: number = children; c > 0; c--) {
		sum += sumMetadata(inArr);
	}
	sum += inArr.splice(0, entries).reduce((r, v) => r + v, 0);
	return sum;
}

console.log("Part 1 answer:", sumMetadata(input));
