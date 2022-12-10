import * as inputs from "./input";

type Instruction = {
	type: "noop" | "addx";
	value: number;
};

type Task = ((x: number) => number) | boolean;

function parseInput(input: string): Instruction[] {
	return input.split("\n").map(function (i) {
		const [type, value] = i.split(" ");
		const t: "noop" | "addx" = type as "noop" | "addx";
		return {
			type: t,
			value: parseInt(value, 10),
		};
	});
}

class CPU {
	x = 1;
	tasks: Task[] = [];

	addInstruction(instruction: Instruction) {
		switch (instruction.type) {
			case "noop":
				this.addTask(1, false);
				break;
			case "addx":
				this.addTask(2, (x) => (x += instruction.value));
				break;
		}
	}

	addTask(cycles: number, task: Task) {
		for (let i = 0; i < cycles - 1; i++) {
			this.tasks.push(true);
		}
		this.tasks.push(task);
	}

	processTask(task: Task) {
		if (typeof task !== "function") {
			return;
		}
		this.x = task(this.x);
	}

	cycle(): [number, number, boolean] {
		const regStart = this.x;
		if (this.tasks.length === 0) {
			return [regStart, this.x, true];
		}
		this.processTask(this.tasks.shift()!);
		return [regStart, this.x, false];
	}
}

class CRT {
	screen: string[][];
	width: number;
	height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.reset();
	}

	reset() {
		this.screen = new Array(this.height);
		for (let i = 0; i < this.height; i++) {
			this.screen[i] = new Array(this.width).fill(".");
		}
	}

	drawHorizontal(x: number) {
		const row = (x / this.width) | 0;
		const col = x % this.width;
		this.draw(col, row);
	}

	draw(x: number, y: number) {
		if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
			return;
		}
		this.screen[y][x] = "#";
	}

	display(): string {
		return this.screen.map((row) => row.join("")).join("\n");
	}
}

const cpu = new CPU();
const crt = new CRT(40, 6);

for (const instruction of parseInput(inputs.input)) {
	cpu.addInstruction(instruction);
}

let part1 = 0;
crt.drawHorizontal(0);
for (let i = 1; ; i++) {
	const [regStart, regEnd, done] = cpu.cycle();
	if ([20, 60, 100, 140, 180, 220].includes(i)) {
		part1 += i * regStart;
	}

	if (Math.abs((i % crt.width) - regEnd) <= 1) {
		crt.drawHorizontal(i);
	}

	if (done) {
		break;
	}
}

console.log("Part 1:", part1);
console.log("Part 2:");
console.log(crt.display());
