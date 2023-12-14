import { input as inp } from "./input"

const dish = inp.split("\n").map((l) => l.split(""))

function tiltNorth(dish: string[][]) {
	dish = structuredClone(dish)
	for (let y = 0; y < dish.length; y++) {
		for (let x = 0; x < dish[0].length; x++) {
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

function draw(dish: string[][]) {
	console.log(dish.map((l) => l.join("")).join("\n"))
}

function dishLoad(dish: string[][]) {
	return dish.reduce((acc, row, i, arr) => {
		return acc + row.filter((c) => c === "O").length * (arr.length - i)
	}, 0)
}

console.log("Part 1:", dishLoad(tiltNorth(dish)))
