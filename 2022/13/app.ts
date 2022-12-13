import * as inputs from "./input";

type Signal = (number | Signal)[];
type SignalPair = [Signal, Signal];

function parseInput(input: string): SignalPair[] {
	return input.split("\n\n").map((signal) => {
		const pair = signal.split("\n");
		return [eval(pair[0]) as Signal, eval(pair[1]) as Signal];
	});
}

function compareOrder(signals: SignalPair): number {
	const [a, b] = signals;
	for (let i = 0; i < a.length; i++) {
		// A is longer than B, not valid signal
		if (i >= b.length) {
			return -1;
		}
		if (isSignal(a[i]) && isSignal(b[i])) {
			// @ts-ignore - it's being dumb about the type guard
			const result = compareOrder([a[i], b[i]]);
			if (result !== 0) {
				return result;
			}
		} else if (isSignal(a[i])) {
			// @ts-ignore - it's being dumb about the type guard
			const result = compareOrder([a[i], [b[i]]]);
			if (result !== 0) {
				return result;
			}
		} else if (isSignal(b[i])) {
			// @ts-ignore - it's being dumb about the type guard
			const result = compareOrder([[a[i]], b[i]]);
			if (result !== 0) {
				return result;
			}
		} else if (a[i] === b[i]) {
			continue;
		} else {
			// @ts-ignore - it's being dumb about the type guards
			return b[i] - a[i];
		}
	}
	if (a.length < b.length) {
		return 1;
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
		if (compareOrder(pair) > 0) {
			return acc + i + 1;
		} else return acc;
	}, 0)
);

const signals: Signal[] = pairs.flat();

const dividerPackets: Signal[] = [[[2]], [[6]]];
signals.push(...dividerPackets);
signals.sort((a, b) => compareOrder([b, a]));

// Find index of divider packets
const dividerIndices = signals.reduce((acc, signal, i) => {
	if (compareOrder([signal, dividerPackets[0]]) === 0) {
		acc[0] = i + 1;
	} else if (compareOrder([signal, dividerPackets[1]]) === 0) {
		acc[1] = i + 1;
	}
	return acc;
});
console.log(
	"Part 2:",
	(dividerIndices[0] as number) * (dividerIndices[1] as number)
);
