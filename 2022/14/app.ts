import * as inputs from "./input";

enum Cell {
	Air = "air",
	Wall = "wall",
	Sand = "sand",
}

type CavernSlice = {
	grid: Record<number, Record<number, Cell>>;
	lowestY: number;
};

function parseInput(input: string): CavernSlice {
	const cavernSlice: CavernSlice = {
		grid: {},
		lowestY: 0,
	};
	for (const line of input.split("\n")) {
		const coordinatePairs = line.split(" -> ");
		let previousCoordinate: [number, number] | null = null;
		for (const coordinatePair of coordinatePairs) {
			const [x, y] = coordinatePair.split(",").map(Number);
			if (!cavernSlice.grid[x]) {
				cavernSlice.grid[x] = {};
			}
			cavernSlice.grid[x][y] = Cell.Wall;
			if (previousCoordinate) {
				// Mark every step between the two coordinates as wall
				const [previousX, previousY] = previousCoordinate;
				const [xDirection, yDirection] = [
					Math.sign(x - previousX),
					Math.sign(y - previousY),
				];
				let currentX = previousX;
				let currentY = previousY;
				while (currentX !== x || currentY !== y) {
					currentX += xDirection;
					currentY += yDirection;
					if (!cavernSlice.grid[currentX]) {
						cavernSlice.grid[currentX] = {};
					}
					cavernSlice.grid[currentX][currentY] = Cell.Wall;
				}
			}
			previousCoordinate = [x, y];
			if (y > cavernSlice.lowestY) {
				cavernSlice.lowestY = y;
			}
		}
	}
	return cavernSlice;
}

function getCell(cavernSlice: CavernSlice, x: number, y: number): Cell {
	return cavernSlice.grid[x]?.[y] || Cell.Air;
}

function setCell(
	cavernSlice: CavernSlice,
	x: number,
	y: number,
	cell: Cell
): void {
	if (!cavernSlice.grid[x]) {
		cavernSlice.grid[x] = {};
	}
	cavernSlice.grid[x][y] = cell;
}

function dropSand(
	cavernSlice: CavernSlice,
	withFloor: boolean,
	x: number = 500,
	y: number = 0
): boolean {
	if (y > cavernSlice.lowestY) {
		setCell(cavernSlice, x, y, Cell.Sand);
		return withFloor;
	}
	if (getCell(cavernSlice, x, y + 1) === Cell.Air) {
		return dropSand(cavernSlice, withFloor, x, y + 1);
	} else if (getCell(cavernSlice, x - 1, y + 1) === Cell.Air) {
		return dropSand(cavernSlice, withFloor, x - 1, y + 1);
	} else if (getCell(cavernSlice, x + 1, y + 1) === Cell.Air) {
		return dropSand(cavernSlice, withFloor, x + 1, y + 1);
	} else {
		setCell(cavernSlice, x, y, Cell.Sand);
		return true;
	}
}

const cavernSlice = parseInput(inputs.input);

function piecesOfSand(cavernSlice: CavernSlice, withFloor: boolean): number {
	let dropped = 0;
	for (
		;
		getCell(cavernSlice, 500, 0) !== Cell.Sand &&
		dropSand(cavernSlice, withFloor);
		dropped++
	) {
		// drawCavernSlice(cavernSlice);
	}
	return dropped;
}
console.log("Part 1:", piecesOfSand(cavernSlice, false));

const cavernSlice2 = parseInput(inputs.input);
console.log("Part 2:", piecesOfSand(cavernSlice2, true));

function drawCavernSlice(cavernSlice: CavernSlice): void {
	const xValues = Object.keys(cavernSlice.grid).map(Number);
	const yValues = Object.values(cavernSlice.grid)
		.map((column) => Object.keys(column).map(Number))
		.flat();
	const minX = Math.min(...xValues);
	const maxX = Math.max(...xValues);
	const minY = Math.min(...yValues);
	const maxY = Math.max(...yValues);
	let output = "";
	for (let y = minY; y <= maxY; y++) {
		for (let x = minX; x <= maxX; x++) {
			switch (getCell(cavernSlice, x, y)) {
				case Cell.Air:
					output += ".";
					break;
				case Cell.Wall:
					output += "#";
					break;
				case Cell.Sand:
					output += "~";
					break;
			}
		}
		output += "\n";
	}
	console.log(output);
}
