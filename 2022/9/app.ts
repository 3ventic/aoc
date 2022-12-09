import * as input from "./input";

type Point = {
	x: number;
	y: number;
};

type Direction = "U" | "D" | "L" | "R";

class Rope {
	points: Point[] = [];
	tailHistory: Set<string>;

	constructor(points: number) {
		for (let i = 0; i < points; i++) {
			this.points.push({ x: 0, y: 0 });
		}
		this.tailHistory = new Set();
		this.pushHistory();
	}

	move(direction: Direction, distance: number) {
		for (let i = 0; i < distance; i++) {
			this.moveOnce(direction);
		}
	}

	moveOnce(direction: Direction) {
		const head = this.points[0];
		switch (direction) {
			case "U":
				head.y++;
				break;
			case "D":
				head.y--;
				break;
			case "L":
				head.x--;
				break;
			case "R":
				head.x++;
				break;
		}
		this.followTail(direction, 0);
	}

	followTail(direction: Direction, idx: number) {
		if (idx === this.points.length - 1) {
			return;
		}

		const head = this.points[idx];
		const tail = this.points[idx + 1];

		// If tail is more than one unit away from head, move it closer
		const xDiff = Math.abs(head.x - tail.x);
		const yDiff = Math.abs(head.y - tail.y);
		if (xDiff <= 1 && yDiff <= 1) {
			return;
		}

		// Possible diff combinations: 2,1 1,2 2,0 0,2
		if (yDiff) {
			tail.y += head.y > tail.y ? 1 : -1;
		}
		if (xDiff) {
			tail.x += head.x > tail.x ? 1 : -1;
		}

		this.pushHistory();
		this.followTail(direction, idx + 1);
	}

	pushHistory() {
		const tail = this.points[this.points.length - 1];
		this.tailHistory.add(`${tail.x},${tail.y}`);
	}
}

function parseInput(input: string): [Direction, number][] {
	return input.split("\n").map((line) => {
		const [direction, distance] = line.split(" ");
		return [direction as Direction, parseInt(distance)];
	});
}

const rope = new Rope(2);
const rope2 = new Rope(10);

for (const [direction, distance] of parseInput(input.input)) {
	rope.move(direction, distance);
	rope2.move(direction, distance);
}

console.log("Part 1:", rope.tailHistory.size);
console.log("Part 2:", rope2.tailHistory.size);
