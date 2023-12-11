import { input as inp } from "./input"

const galaxy = inp.split("\n").map((line) => line.split(""))

const expandingRows: number[] = []
const expandingCols: number[] = []
const maxY = galaxy.length - 1
const maxX = galaxy[0].length - 1
const galaxies: number[][] = []
for (let y = 0; y < galaxy.length; y++) {
	for (let x = 0; x < galaxy[y].length; x++) {
		if (galaxy[y][x] === "#") {
			galaxies.push([y, x])
		}
	}
}

for (let y = 0; y <= maxY; y++) {
	if (!galaxies.some(([gy]) => gy === y)) {
		expandingRows.push(y)
	}
}

for (let x = 0; x <= maxX; x++) {
	if (!galaxies.some(([, gx]) => gx === x)) {
		expandingCols.push(x)
	}
}

function expandDistance(
	dist: number,
	expansion: number[],
	n1: number,
	n2: number,
	expandBy = 1
): number {
	for (let n = 0; n < expansion.length; n++) {
		// if distance crosses an expanding row, expand the distance
		const er = expansion[n]
		if ((n1 < er && n2 > er) || (n1 > er && n2 < er)) {
			dist += expandBy
		}
	}
	return dist
}

const distances = galaxies.reduce(
	(acc, [gy, gx], i, arr) => {
		// Manhattan distance between all pairs
		for (let j = i + 1; j < arr.length; j++) {
			const [gy2, gx2] = arr[j]
			let dist = Math.abs(gy - gy2) + Math.abs(gx - gx2)
			let part1 = expandDistance(dist, expandingRows, gy, gy2)
			part1 = expandDistance(part1, expandingCols, gx, gx2)
			let part2 = expandDistance(dist, expandingRows, gy, gy2, 1_000_000 - 1)
			part2 = expandDistance(part2, expandingCols, gx, gx2, 1_000_000 - 1)
			acc.part1.push(part1)
			acc.part2.push(part2)
		}
		return acc
	},
	{ part1: [] as number[], part2: [] as number[] }
)

const part1 = distances.part1.reduce((acc, dist) => acc + dist, 0)
console.log("Part 1:", part1)

const part2 = distances.part2.reduce((acc, dist) => acc + dist, 0)
console.log("Part 2:", part2)
