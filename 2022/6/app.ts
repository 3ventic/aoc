import * as inputs from "./input";

function findSignal(input: string, length: number): number {
	for (let i = length; i < input.length; i++) {
		const signalTracker = new Set<string>();
		for (let j = 0; j < length; j++) {
			signalTracker.add(input[i - j]);
		}
		if (signalTracker.size === length) {
			return i + 1;
		}
	}
	return 0;
}

for (const input of inputs.sampleInputs) {
	console.log(findSignal(input, 4));
}

console.log("Part 1:", findSignal(inputs.input, 4));
console.log("Part 2:", findSignal(inputs.input, 14));
