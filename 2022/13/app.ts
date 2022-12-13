import * as inputs from "./input";

type Signal = (number | Signal)[];
type SignalPair = [Signal, Signal];

function parseInput(input: string): SignalPair[] {
	return input.split("\n\n").map((signal) => {
		const pair = signal.split("\n");
		return [eval(pair[0]) as Signal, eval(pair[1]) as Signal];
	});
}

function compareOrder(a: Signal, b: Signal): number {
	for (let i = 0; i < a.length; i++) {
		// A is longer than B, not valid signal
		if (i >= b.length) {
			return 1;
		}
		const first = a[i];
		const second = b[i];
		if (isSignal(first) && isSignal(second)) {
			const result = compareOrder(first, second);
			if (result !== 0) {
				return result;
			}
		} else if (isSignal(first)) {
			const result = compareOrder(first, [second]);
			if (result !== 0) {
				return result;
			}
		} else if (isSignal(second)) {
			const result = compareOrder([first], second);
			if (result !== 0) {
				return result;
			}
		} else if (first === second) {
			continue;
		} else {
			return first - second;
		}
	}
	if (a.length < b.length) {
		return -1;
	}
	return 0;
}

function isSignal(signal: number | Signal): signal is Signal {
	return Array.isArray(signal);
}

const pairs = parseInput(inputs.input);
console.log(
	"Part 1:",
	pairs.reduce((acc, pair, i) => {
		if (compareOrder(pair[0], pair[1]) < 0) {
			return acc + i + 1;
		} else return acc;
	}, 0)
);

const signals: Signal[] = pairs.flat();

const dividerPackets: Signal[] = [[[2]], [[6]]];
signals.push(...dividerPackets);
signals.sort(compareOrder);

// Find index of divider packets
const dividerIndices = signals.reduce((acc, signal, i) => {
	if (compareOrder(signal, dividerPackets[0]) === 0) {
		acc[0] = i + 1;
	} else if (compareOrder(signal, dividerPackets[1]) === 0) {
		acc[1] = i + 1;
	}
	return acc;
});
console.log(
	"Part 2:",
	(dividerIndices[0] as number) * (dividerIndices[1] as number)
);
