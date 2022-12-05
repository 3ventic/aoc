import * as inputs from "./input";

type State = {
	moves: [number, number, number][];
	stacks1: Record<number, string[]>;
	stacks2: Record<number, string[]>;
};

function parseInput(input: string): State {
	const lines = input.split("\n");
	const idx = lines.findIndex((line) => line === "");
	const stackDef = lines.slice(0, idx);
	const moveDef = lines.slice(idx + 1);
	const numOfStacks = stackDef
		.pop()!
		.split(/\s+/g)
		.filter((n) => n)
		.map((n) => parseInt(n, 10))
		.pop()!;

	const state = {
		moves: moveDef.map((line) => {
			const match = /move (\d+) from (\d+) to (\d+)/.exec(line);
			const ret: [number, number, number] = [
				parseInt(match![1], 10),
				parseInt(match![2], 10),
				parseInt(match![3], 10),
			];
			return ret;
		}),
		stacks1: {},
		stacks2: {},
	};

	for (let i = 1; i <= numOfStacks; i++) {
		state.stacks1[i] = [];
		state.stacks2[i] = [];
	}

	for (let i = stackDef.length - 1; i >= 0; i--) {
		let stack = 0;
		for (let j = 0; j < stackDef[i].length; j++) {
			if (j % 4 === 0) {
				stack++;
			}
			if (/[A-Z]/.test(stackDef[i][j])) {
				state.stacks1[stack].push(stackDef[i][j]);
				state.stacks2[stack].push(stackDef[i][j]);
			}
		}
	}
	return state;
}

const state = parseInput(inputs.input);

for (const move of state.moves) {
	const [crates, from, to] = move;
	for (let i = 0; i < crates; i++) {
		state.stacks1[to].push(state.stacks1[from].pop()!);
	}
	const moved = state.stacks2[from].splice(-crates);
	state.stacks2[to].push(...moved);
}

function printResult(part: number) {
	console.log(
		"Part",
		part,
		Object.values(state[`stacks${part}`])
			.map((s) => {
				const stack = s as string[];
				return stack[stack.length - 1];
			})
			.join("")
	);
}

printResult(1);
printResult(2);
