import * as input from "./input";

function inputToBool(c: string): boolean {
	switch (c) {
		case "#":
			return true;
		case ".":
			return false;
		default:
			throw new Error("invalid input character");
	}
}

const inputMapper: Map<boolean, Map<boolean, Map<boolean, Map<boolean, Map<boolean, boolean>>>>> = new Map();
for (let i: number = 0; i < input.rules.length; i++) {
	const ruleAndOutcome: string[] = input.rules[i].split(" => ");
	const rule: boolean[] = Array.from(ruleAndOutcome[0]).map(inputToBool);
	const outcome: boolean = inputToBool(ruleAndOutcome[1]);
	const m: Map<boolean, Map<boolean, Map<boolean, Map<boolean, boolean>>>> =
		inputMapper.get(rule[0]) || inputMapper.set(rule[0], new Map()).get(rule[0])!;
	const m2: Map<boolean, Map<boolean, Map<boolean, boolean>>> =
		m.get(rule[1]) || m.set(rule[1], new Map()).get(rule[1])!;
	const m3: Map<boolean, Map<boolean, boolean>> = m2.get(rule[2]) || m2.set(rule[2], new Map()).get(rule[2])!;
	const m4: Map<boolean, boolean> = m3.get(rule[3]) || m3.set(rule[3], new Map()).get(rule[3])!;
	m4.set(rule[4], outcome);
}

let state: boolean[] = input.state.map(inputToBool);

interface IGeneration {
	state: boolean[];
	potsOnLeft: number;
}

function getGeneration(state: boolean[], generations: number): IGeneration {
	let potsOnLeft: number = 0;
	const cache: { [key: string]: IGeneration } = {};
	let cycle: string[] = [];

	for (let i: number = 0; i < generations; i++) {
		const startPots: number = potsOnLeft;
		const cacheKey: string = state.toString();
		const cached: IGeneration = cache[cacheKey];
		if (cached) {
			if (cycle.indexOf(cacheKey) === -1) {
				cycle.push(cacheKey);
			} else {
				// this only works with cycle.length === 1 right now, which matches my input, but could be generalized with a bit more work
				const potsLeftPerCycle: number = cycle.map(k => cache[k].potsOnLeft).reduce((r, v) => r + v, 0);
				const generationsToGo: number = generations - i;
				const loops: number = Math.floor(generationsToGo / cycle.length);
				potsOnLeft += potsLeftPerCycle * loops;
				return { state, potsOnLeft };
			}
			state = cached.state;
			potsOnLeft += cached.potsOnLeft;
		} else {
			cycle = [];
			state = ensureSpace(state);
			state = nextGeneration(state);
			state = trimSpace(state);
			cache[cacheKey] = {
				potsOnLeft: potsOnLeft - startPots,
				state: state
			};
		}
		if ((i + 1) % 1000000 === 0) {
			console.log(potsOnLeft);
			print(i + 1, state);
		}
	}

	return {
		state: state,
		potsOnLeft: potsOnLeft
	};

	function trimSpace(state: boolean[]): boolean[] {
		const start: number = state.indexOf(true);
		state.splice(0, start);
		potsOnLeft -= start;
		const end: number = state.lastIndexOf(true);
		state.splice(end + 1, state.length - 1 - end);
		return state;
	}

	function ensureSpace(state: boolean[]): boolean[] {
		let left: number = 0;
		if (state[0]) {
			left = 2;
		} else if (state[1]) {
			left = 1;
		}
		potsOnLeft += left;
		state = new Array(left).fill(false).concat(state);

		let right: number = 0;
		if (state[state.length - 1]) {
			right = 3;
		} else if (state[state.length - 2]) {
			right = 2;
		} else if (state[state.length - 1]) {
			right = 1;
		}
		state = state.concat(new Array(right).fill(false));
		return state;
	}

	function nextGeneration(state: boolean[]): boolean[] {
		let newState: boolean[] = new Array(state.length);
		for (let i: number = 0; i < state.length; i++) {
			newState[i] = inputMapper
				.get(state[i - 2] || false)!
				.get(state[i - 1] || false)!
				.get(state[i] || false)!
				.get(state[i + 1] || false)!
				.get(state[i + 2] || false)!;
		}
		return newState;
	}
}

const p1: IGeneration = getGeneration(state.slice(), 20);
console.log(
	"Part 1 answer:",
	p1.state.map(v => (v ? 1 : 0)).reduce((r, v, i) => (r += v === 1 ? i - p1.potsOnLeft : 0), 0)
);

const p2: IGeneration = getGeneration(state.slice(), 50000000000);
console.log(
	"Part 2 answer:",
	p2.state.map(v => (v ? 1 : 0)).reduce((r, v, i) => (r += v === 1 ? i - p2.potsOnLeft : 0), 0)
);

function print(gen: number, state: boolean[]): void {
	console.log(gen, state.map(v => (v ? "#" : ".")).join(""));
}
