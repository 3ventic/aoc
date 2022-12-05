import * as inputs from "./input";

type State = {
	moves: [number, number, number][];
	stacks: Record<number, string[]>[];
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

	const state: State = {
		moves: moveDef.map((line) => {
			const match = /move (\d+) from (\d+) to (\d+)/.exec(line);
			const ret: [number, number, number] = [
				parseInt(match![1], 10),
				parseInt(match![2], 10),
				parseInt(match![3], 10),
			];
			return ret;
		}),
		stacks: [{}, {}],
	};

	for (let i = 1; i <= numOfStacks; i++) {
		for (let j = 0; j < state.stacks.length; j++) {
			state.stacks[j][i] = [];
		}
	}

	for (let i = stackDef.length - 1; i >= 0; i--) {
		for (let stack = 1; stack <= numOfStacks; stack++) {
			const char = stackDef[i][stack * 4 - 3];
			if (char === " ") {
				continue;
			}
			for (let j = 0; j < state.stacks.length; j++) {
				state.stacks[j][stack].push(char);
			}
		}
	}
	return state;
}

const state = parseInput(inputs.input);

for (const move of state.moves) {
	const [crates, from, to] = move;
	for (let i = 0; i < crates; i++) {
		state.stacks[0][to].push(state.stacks[0][from].pop()!);
	}
	const moved = state.stacks[1][from].splice(-crates);
	state.stacks[1][to].push(...moved);
}

function printResult(part: number) {
	console.log(
		"Part",
		part,
		Object.values(state.stacks[part - 1])
			.map((s) => {
				const stack = s as string[];
				return stack[stack.length - 1];
			})
			.join("")
	);
}

printResult(1);
printResult(2);
