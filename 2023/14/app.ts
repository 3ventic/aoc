import { input as inp } from "./input"

const dish = inp.split("\n").map((l) => l.split(""))

function tiltNorth(dish: string[][]) {
	for (let y = 0; y < dish.length; y++) {
		for (let x = 0; x < dish[y].length; x++) {
			if (dish[y][x] === "O") {
				for (let newY = y - 1; newY >= 0; newY--) {
					if (dish[newY][x] === ".") {
						dish[newY][x] = "O"
						dish[newY + 1][x] = "."
					} else {
						break
					}
				}
			}
		}
	}
	return dish
}

function tiltWest(dish: string[][]) {
	for (let y = 0; y < dish.length; y++) {
		for (let x = 0; x < dish[y].length; x++) {
			if (dish[y][x] === "O") {
				for (let newX = x - 1; newX >= 0; newX--) {
					if (dish[y][newX] === ".") {
						dish[y][newX] = "O"
						dish[y][newX + 1] = "."
					} else {
						break
					}
				}
			}
		}
	}
	return dish
}

function tiltSouth(dish: string[][]) {
	for (let y = dish.length - 1; y >= 0; y--) {
		for (let x = 0; x < dish[y].length; x++) {
			if (dish[y][x] === "O") {
				for (let newY = y + 1; newY < dish.length; newY++) {
					if (dish[newY][x] === ".") {
						dish[newY][x] = "O"
						dish[newY - 1][x] = "."
					} else {
						break
					}
				}
			}
		}
	}
	return dish
}

function tiltEast(dish: string[][]) {
	for (let y = 0; y < dish.length; y++) {
		for (let x = dish[y].length - 1; x >= 0; x--) {
			if (dish[y][x] === "O") {
				for (let newX = x + 1; newX < dish[y].length; newX++) {
					if (dish[y][newX] === ".") {
						dish[y][newX] = "O"
						dish[y][newX - 1] = "."
					} else {
						break
					}
				}
			}
		}
	}
	return dish
}

function draw(dish: string[][]) {
	console.log(dish.map((l) => l.join("")).join("\n") + "\n")
}

function dishLoad(dish: string[][]) {
	return dish.reduce((acc, row, i, arr) => {
		return acc + row.filter((c) => c === "O").length * (arr.length - i)
	}, 0)
}

function cycle(dish: string[][]) {
	let d = dish
	d = tiltNorth(d)
	d = tiltWest(d)
	d = tiltSouth(d)
	d = tiltEast(d)
	return d
}

console.log("Part 1:", dishLoad(tiltNorth(structuredClone(dish))))

let cleanedDish = dish
const iters = 1000000000
const pastDishes: string[][][] = []
for (let i = 0; i < iters; i++) {
	const cycleStart = pastDishes.findIndex((d) =>
		d.every((row, i) => row.every((c, j) => c === cleanedDish[i][j]))
	)
	if (cycleStart !== -1) {
		// Cyclic output, extrapolate the rest
		const cycleLength = pastDishes.length - cycleStart
		const cycleOffsetAtEnd = (iters - cycleStart) % cycleLength
		console.log("Part 2:", dishLoad(pastDishes[cycleStart + cycleOffsetAtEnd]))
		break
	}
	pastDishes.push(structuredClone(cleanedDish))
	cleanedDish = cycle(cleanedDish)
}
