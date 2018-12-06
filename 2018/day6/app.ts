import input from "./input";

interface ICoordinate {
	x: number;
	y: number;
}

interface IBounds {
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
}

const boundBuffer: number = 10;

let bounds: IBounds | null = null;
const coordinates: ICoordinate[] = input.map(s => {
	const c: string[] = s.split(",");
	const x: number = parseInt(c[0].trim(), 10);
	const y: number = parseInt(c[1].trim(), 10);
	if (bounds === null) {
		bounds = {
			minX: x,
			maxX: x,
			minY: y,
			maxY: y
		};
	} else {
		if (x - boundBuffer < bounds.minX) {
			bounds.minX = x - boundBuffer;
		}
		if (x + boundBuffer > bounds.maxX) {
			bounds.maxX = x + boundBuffer;
		}
		if (y - boundBuffer < bounds.minY) {
			bounds.minY = y - boundBuffer;
		}
		if (y + boundBuffer > bounds.maxY) {
			bounds.maxY = y + boundBuffer;
		}
	}
	const coord: ICoordinate = {
		x: x,
		y: y
	};
	return coord;
});

bounds = bounds!;

const manhattanDistance: (a: ICoordinate, b: ICoordinate) => number = (a: ICoordinate, b: ICoordinate): number =>
	Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

let areas: Map<ICoordinate, number> = new Map();
const range: number = 10000;
let inRange: number = 0;
let infiniteAreas: ICoordinate[] = [];
// let m: string[][] = [];
for (let x: number = bounds.minX; x <= bounds.maxX; x++) {
	// let my: string[] = [];
	for (let y: number = bounds.minY; y <= bounds.maxY; y++) {
		let closest: ICoordinate | null = null;
		let distance: number = Number.MAX_SAFE_INTEGER;
		let distanceTotals: number = 0;
		for (const coord of coordinates) {
			let d: number = manhattanDistance({ x, y }, coord);
			if (d < distance) {
				closest = coord;
				distance = d;
			} else if (d === distance) {
				closest = null;
			}
			distanceTotals += d;
		}
		if (distanceTotals < range) {
			inRange++;
		}
		if (closest !== null) {
			if (x === bounds.minX || x === bounds.maxX || y === bounds.minY || y === bounds.maxY) {
				// where edge coordinates are closest, area expands beyond bounds and is considered infinite
				if (infiniteAreas.indexOf(closest) === -1) {
					infiniteAreas.push(closest);
				}
			}
			let area: number | undefined = areas.get(closest);
			if (!area) {
				area = 0;
			}
			areas.set(closest, area + 1);
			// my.push(String.fromCodePoint(0x30 + coordinates.indexOf(closest)));
		} else {
			// my.push(".");
		}
	}
	// m.push(my);
}

// for (let x: number = 0; x < m.length; x++) {
// 	console.log(m[x].join(" "));
// }

interface IArea {
	coord: ICoordinate;
	size: number;
}
let largest: IArea = { coord: { x: 0, y: 0 }, size: 0 };
for (const [coord, size] of areas) {
	if (size > largest.size && infiniteAreas.indexOf(coord) === -1) {
		largest = {
			coord: coord,
			size: size
		};
	}
}

console.log("Part 1 answer:", largest.size);
console.log("Part 2 answer:", inRange);
