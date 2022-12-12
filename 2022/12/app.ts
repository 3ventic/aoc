import * as inputs from "./input";

// Shoutout to https://www.redblobgames.com/pathfinding/a-star/introduction.html

type Point = {
	x: number;
	y: number;
	value: number;
};

function initValue(char: string): number {
	if (char === "S") {
		char = "a";
	} else if (char === "E") {
		char = "z";
	}
	return char.charCodeAt(0);
}

function parseInput(input: string): [Point[][], Point, Point] {
	let start: Point = {} as Point;
	let end: Point = {} as Point;
	return [
		input.split("\n").map((line, y) =>
			Array.from(line).map((char, x) => {
				const p = {
					x,
					y,
					value: initValue(char),
				};
				if (char === "S") {
					start = p;
				} else if (char === "E") {
					end = p;
				}
				return p;
			})
		),
		start,
		end,
	];
}

function shortestDistanceBreadthFirst(
	area: Point[][],
	start: Point,
	end: (current: Point) => boolean,
	wall: (current: Point, neighbor: Point) => boolean
): number {
	const queue: Point[] = [start];
	const cameFrom: Map<Point, Point | null> = new Map();
	cameFrom.set(start, null);
	while (queue.length > 0) {
		const current = queue.shift()!;
		if (end(current)) {
			let path = 0;
			let p = current;
			while (p !== start) {
				path++;
				p = cameFrom.get(p)!;
			}
			return path;
		}
		const neighbors = [
			{ x: current.x - 1, y: current.y },
			{ x: current.x + 1, y: current.y },
			{ x: current.x, y: current.y - 1 },
			{ x: current.x, y: current.y + 1 },
		];
		for (const neighbor of neighbors) {
			const { x, y } = neighbor;
			if (x < 0 || y < 0 || x >= area[0].length || y >= area.length) {
				continue;
			}
			const point = area[y][x];
			if (cameFrom.has(area[neighbor.y][neighbor.x]) || wall(current, point)) {
				continue;
			}
			cameFrom.set(point, current);
			queue.push(point);
		}
	}
	console.log(cameFrom);
	return -1;
}

const [area, start, end] = parseInput(inputs.input);
const wall = (current: Point, neighbor: Point) =>
	current.value - 1 > neighbor.value;
const isPoint = (point: Point) => (current: Point) =>
	current.x === point.x && current.y === point.y;

console.log(
	"Part 1:",
	shortestDistanceBreadthFirst(area, end, isPoint(start), wall)
);
console.log(
	"Part 2:",
	shortestDistanceBreadthFirst(
		area,
		end,
		(point) => point.value === "a".charCodeAt(0),
		wall
	)
);
