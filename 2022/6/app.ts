import * as inputs from "./input";

function findSignal(input: string, length: number): number {
	let signalTracker: string[] = [];

	outer: for (let i = 0; i < input.length; i++) {
		const c = input[i];
		for (let j = 0; j < signalTracker.length; j++) {
			if (signalTracker[j] === c) {
				signalTracker = [...signalTracker.slice(j + 1), c];
				continue outer;
			}
		}
		signalTracker.push(c);
		if (signalTracker.length === length) {
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
