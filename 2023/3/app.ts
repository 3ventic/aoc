import { input as inp } from "./input"

type Cell = number | string | boolean

function parseInput(input: string): Cell[][] {
	return input.split("\n").map((line) =>
		line.split("").map((c) => {
			if (c === ".") return false
			if (/^\d$/.test(c)) return parseInt(c)
			return c
		})
	)
}

function numbersWithAdjacentSymbols(
	table: Cell[][],
	resultMutator?: (cell: Cell, adjacents: number[]) => boolean | number
): number[] {
	const counted: Map<string, boolean> = new Map()
	const result: number[] = []
	for (let y = 0; y < table.length; y++) {
		for (let x = 0; x < table[y].length; x++) {
			const intermediateResult: number[] = []
			const cell = table[y][x]
			if (typeof cell !== "string") {
				continue
			}
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dy === 0 && dx === 0) continue
					const [nx, ny] = [x + dx, y + dy]
					if (nx < 0 || ny < 0 || nx >= table[y].length || ny >= table.length)
						continue

					if (typeof table[ny][nx] !== "number") continue

					// Find the whole number on the X axis
					const number: number[] = [table[ny][nx] as number]
					let minX = nx
					for (let sx = nx - 1; sx >= 0; sx--) {
						if (typeof table[ny][sx] !== "number") break
						number.unshift(table[ny][sx] as number)
						minX = sx
					}
					for (let sx = nx + 1; sx < table.length; sx++) {
						if (typeof table[ny][sx] !== "number") break
						number.push(table[ny][sx] as number)
					}

					// Guard against multiple adjacent digits that are part of the same number
					const key = `${minX},${ny}`
					if (counted.has(key)) continue
					counted.set(key, true)

					// Convert the array of digits into a number and add to results
					let total = 0
					for (const n of number) {
						total = total * 10 + n
					}
					intermediateResult.push(total)
				}
			}

			const r = resultMutator?.(cell, intermediateResult) ?? true
			if (typeof r === "number") {
				result.push(r)
			} else if (r === false) {
				continue
			} else {
				result.push(...intermediateResult)
			}
		}
	}
	return result
}

const table = parseInput(inp)
const numbers = numbersWithAdjacentSymbols(table)
const sum = numbers.reduce((a, b) => a + b, 0)

console.log("Part 1:", sum)

const numbers2 = numbersWithAdjacentSymbols(table, (cell, adjacents) => {
	if (cell !== "*" || adjacents.length !== 2) {
		return false
	}
	return adjacents[0] * adjacents[1]
})

const sum2 = numbers2.reduce((a, b) => a + b, 0)
console.log("Part 2:", sum2)
