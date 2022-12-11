import * as inputs from "./input";

type Monkey = {
	name: string;
	items: number[];
	operation: string;
	test: (n: number) => boolean;
	next: [string, string];
	inspected: number;
};

function parseInput(input: string): Map<string, Monkey> {
	const monkeys = new Map<string, Monkey>();
	for (const monkeyIn of input.split("\n\n")) {
		const match = monkeyIn.match(
			/Monkey (\d+):\n  Starting items: ((?:\d+(?:, )?)*)\n  Operation: (.+)\n  Test: divisible by (\d+)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)/
		);
		if (!match) {
			console.warn("Failed to parse monkey input: " + monkeyIn);
			continue;
		}
		const [, name, itemsRaw, operation, testRaw, nextTrue, nextFalse] = match;
		const monkey: Monkey = {
			name,
			items: itemsRaw.split(", ").map((i) => parseInt(i, 10)),
			operation: operation.replace(/(new|old)/g, "item"),
			test: (n) => n % parseInt(testRaw, 10) === 0,
			next: [nextFalse, nextTrue],
			inspected: 0,
		};
		monkeys.set(name, monkey);
	}
	return monkeys;
}

function processRound(
	monkeys: Map<string, Monkey>,
	worryReduction: boolean = true
) {
	for (let i = 0; i < monkeys.size; i++) {
		const monkey = monkeys.get(i.toString())!;
		while (monkey.items.length > 0) {
			let item = monkey.items.shift()!;
			eval(monkey.operation);
			if (worryReduction) {
				item /= 3;
				item |= 0;
			}
			const next = monkey.next[Number(monkey.test(item))];
			monkeys.get(next)!.items.push(item);
			monkey.inspected++;
		}
	}
}

const monkeys = parseInput(inputs.input);
const monkeys2 = parseInput(inputs.sample);

for (let i = 0; i < 20; i++) {
	processRound(monkeys);
}
for (let i = 0; i < 10000; i++) {
	if (
		[1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000].includes(i)
	) {
		console.log("Round", i, monkeys2);
	}
	processRound(monkeys2, false);
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
