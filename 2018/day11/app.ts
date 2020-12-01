import input from "./input";

function getPowerLevel(serial: number, x: number, y: number): number {
	const rackID: number = x + 10;
	const total: number = (rackID * y + serial) * rackID;
	return parseInt(Array.from(total.toString()).reverse()[2] || "0", 10) - 5;
}

const gridSize: number = 300;
const serial: number = input;

let powergrid: number[][] = new Array<number[]>(gridSize);
for (let x: number = 0; x < gridSize; x++) {
	powergrid[x] = new Array<number>(gridSize);
	for (let y: number = 0; y < gridSize; y++) {
		powergrid[x][y] = getPowerLevel(serial, x, y);
	}
}

function findLargest(subGridSize: number): { maxCoord: number[]; maxPower: number } {
	let maxCoord: number[] = [];
	let maxPower: number = Number.MIN_SAFE_INTEGER;
	let sub: number = (subGridSize - 1) / 2;
	let add: number = subGridSize % 2 === 0 ? subGridSize / 2 : sub;
	for (let x: number = sub; x < gridSize - add; x++) {
		for (let y: number = sub; y < gridSize - add; y++) {
			let power: number = 0;
			for (let mx: number = -sub; mx <= add; mx++) {
				for (let my: number = -sub; my <= add; my++) {
					power += powergrid[x + mx][y + my];
				}
			}
			if (power > maxPower) {
				maxPower = power;
				maxCoord = [x, y];
			}
		}
	}
	return { maxCoord, maxPower };
}

const { maxCoord } = findLargest(3);

console.log("Part 1 answer:", maxCoord.map(v => v - 1));

let maxCoord2: number[] = [];
let maxSize: number = 0;
let maxPower2: number = Number.MIN_SAFE_INTEGER;
for (let i: number = 1; i < gridSize; i++) {
	const l: { maxCoord: number[]; maxPower: number } = findLargest(i);
	if (l.maxPower > maxPower2) {
		maxPower2 = l.maxPower;
		maxCoord2 = l.maxCoord;
		maxSize = i;
	}
}

console.log(maxPower2);

console.log("Part 2 answer:", maxCoord2.map(v => v - Math.floor((maxSize - 1) / 2)), maxSize);
