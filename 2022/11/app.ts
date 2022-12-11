import * as inputs from "./input";

type Monkey = {
	name: string;
	items: number[];
	operation: (n: number) => number;
	test: (n: number) => boolean;
	next: [string, string];
	inspected: number;
};

function parseInput(input: string): [Map<string, Monkey>, number[]] {
	const monkeys = new Map<string, Monkey>();
	const divisors = new Set<number>();
	for (const monkeyIn of input.split("\n\n")) {
		const match = monkeyIn.match(
			/Monkey (\d+):\n  Starting items: ((?:\d+(?:, )?)*)\n  Operation: new = old (.) (.*)\n  Test: divisible by (\d+)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)/
		);
		if (!match) {
			console.warn("Failed to parse monkey input: " + monkeyIn);
			continue;
		}
		const [
			,
			name,
			itemsRaw,
			operation,
			operandRaw,
			testRaw,
			nextTrue,
			nextFalse,
		] = match;
		const divisor = parseInt(testRaw, 10);
		const monkey: Monkey = {
			name,
			items: itemsRaw.split(", ").map((i) => parseInt(i, 10)),
			operation: (n) => {
				const operand = operandRaw === "old" ? n : parseInt(operandRaw, 10);
				switch (operation) {
					case "+":
						return n + operand;
					case "*":
						return n * operand;
					default:
						console.warn("Unknown operation: " + operation);
						return n;
				}
			},
			test: (n) => n % divisor === 0,
			next: [nextFalse, nextTrue],
			inspected: 0,
		};
		divisors.add(divisor);
		monkeys.set(name, monkey);
	}
	return [monkeys, Array.from(divisors.values())];
}

function processRound(
	monkeys: Map<string, Monkey>,
	worryReduction: boolean = true,
	reduceAbove: number = Number.MAX_SAFE_INTEGER
) {
	for (let i = 0; i < monkeys.size; i++) {
		const monkey = monkeys.get(i.toString())!;
		while (monkey.items.length > 0) {
			let item = monkey.items.shift()!;
			item = monkey.operation(item);
			if (worryReduction) {
				item /= 3;
				item |= 0;
			} else {
				item %= reduceAbove;
			}
			const next = monkey.next[Number(monkey.test(item))];
			monkeys.get(next)!.items.push(item);
			monkey.inspected++;
		}
	}
}

const [monkeys] = parseInput(inputs.input);
const [monkeys2, divisors] = parseInput(inputs.input);

const prime = divisors.reduce((a, b) => a * b);

for (let i = 0; i < 20; i++) {
	processRound(monkeys);
}
for (let i = 0; i < 10000; i++) {
	processRound(monkeys2, false, prime);
}

function multiplyInspected(monkeys: Map<string, Monkey>) {
	return Array.from(monkeys.values())
		.map((monkey) => monkey.inspected)
		.sort((a, b) => b - a)
		.slice(0, 2)
		.reduce((a, b) => a * b);
}

console.log("Part 1:", multiplyInspected(monkeys));
console.log("Part 2:", multiplyInspected(monkeys2));
