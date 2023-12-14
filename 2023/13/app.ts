import { input as inp } from "./input"

const matrices = inp
	.split("\n\n")
	.map((s) => s.split("\n").map((l) => l.split("")))

function findReflection(matrix: string[][], errors: number) {
	yl: for (let y = 0; y < matrix.length - 1; y++) {
		let errCounter = 0
		for (let i = 0; true; i++) {
			const row = matrix[y - i]
			const row2 = matrix[y + 1 + i]
			if (!row || !row2) {
				if (errCounter === errors) {
					return (y + 1) * 100
				}
				continue yl
			}
			let matches = 0
			for (let x = 0; x < row.length; x++) {
				if (row[x] === row2[x]) matches++
			}
			errCounter += row.length - matches
			if (errCounter > errCounter) continue yl
		}
	}

	xl: for (let x = 0; x < matrix[0].length - 1; x++) {
		let errCounter = 0
		for (let i = 0; true; i++) {
			const col = matrix.map((row) => row[x - i])
			const col2 = matrix.map((row) => row[x + 1 + i])
			if (!col[0] || !col2[0]) {
				if (errCounter === errors) {
					return x + 1
				}
				continue xl
			}
			let matches = 0
			for (let y = 0; y < col.length; y++) {
				if (col[y] === col2[y]) matches++
			}
			errCounter += col.length - matches
			if (errCounter > errCounter) continue xl
		}
	}
	return 0
}

console.log(
	"Part 1:",
	matrices.map((m) => findReflection(m, 0)).reduce((a, b) => a + b)
)

console.log(
	"Part 2:",
	matrices.map((m) => findReflection(m, 1)).reduce((a, b) => a + b)
)
