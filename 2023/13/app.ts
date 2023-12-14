import { input as inp } from "./input"

const matrices = inp
	.split("\n\n")
	.map((s) => s.split("\n").map((l) => l.split("")))

function findReflection(matrix: string[][]) {
	yl: for (let y = 0; y < matrix.length - 1; y++) {
		for (let i = 0; true; i++) {
			const row = matrix[y - i]
			const row2 = matrix[y + 1 + i]
			if (!row || !row2) return (y + 1) * 100
			const match = row.every((c, x) => c === row2[x])
			if (!match) continue yl
		}
	}

	xl: for (let x = 0; x < matrix[0].length - 1; x++) {
		for (let i = 0; true; i++) {
			const col = matrix.map((row) => row[x - i])
			const col2 = matrix.map((row) => row[x + 1 + i])
			if (!col[0] || !col2[0]) return x + 1
			const match = col.every((c, y) => c === col2[y])
			if (!match) continue xl
		}
	}
	return 0
}

console.log(
	"Part 1:",
	matrices.map(findReflection).reduce((a, b) => a + b)
)
