import { input as inp } from "./input"

const V = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
} as const

type Velocity = (typeof V)[keyof typeof V]

type VTuple = [Velocity, Velocity]

const verticals: VTuple = [V.up, V.down]
const horizontals: VTuple = [V.left, V.right]

const matrix = inp.split("\n").map((row) =>
	row.split("").map((c) => {
		return {
			value: c,
			enterVelocities: [] as Velocity[],
		}
	})
)

type Matrix = typeof matrix

function traverseBeam(v0: Velocity, m: Matrix, x0 = 0, y0 = 0) {
	if (x0 < 0 || y0 < 0 || y0 >= m.length || x0 >= m[y0].length) {
		return 0
	}

	let energized = 0
	let v = v0

	for (
		let pos = { x: x0, y: y0 };
		pos.x >= 0 && pos.y >= 0 && pos.y < m.length && pos.x < m[pos.y].length;
		pos.y += v.y, pos.x += v.x
	) {
		let cell = m[pos.y][pos.x]
		const nextV = nextVelocities(v, cell.value)
		const isSplit = Array.isArray(nextV)

		const enteredBefore = cell.enterVelocities.includes(v)
		if (enteredBefore) {
			break
		}

		if (cell.enterVelocities.length === 0) {
			energized++
		}
		cell.enterVelocities.push(v)
		if (isSplit) {
			v = nextV[0]
			energized += traverseBeam(
				nextV[1],
				m,
				pos.x + nextV[1].x,
				pos.y + nextV[1].y
			)
		} else {
			v = nextV
		}
	}

	return energized
}

function nextVelocities(v: Velocity, c: string) {
	switch (c) {
		case "/":
			switch (v) {
				case V.up:
					return V.right
				case V.down:
					return V.left
				case V.left:
					return V.down
				case V.right:
					return V.up
			}
			break
		case "\\":
			switch (v) {
				case V.up:
					return V.left
				case V.down:
					return V.right
				case V.left:
					return V.up
				case V.right:
					return V.down
			}
			break
		case "-":
			if (v === V.up || v === V.down) {
				return horizontals
			}
			break
		case "|":
			if (v === V.left || v === V.right) {
				return verticals
			}
			break
		default:
			break
	}
	return v
}

function cleanMatrix(m: Matrix) {
	for (const row of m) {
		for (const cell of row) {
			cell.enterVelocities.length = 0
		}
	}
	return m
}

{
	const m = cleanMatrix(matrix)
	const e = traverseBeam(V.right, m)
	console.log("Part 1:", e)
}

{
	const results: number[] = []
	// Top and bottom edges
	for (let x = 0; x < matrix[0].length; x++) {
		const mt = cleanMatrix(matrix)
		const et = traverseBeam(V.down, mt, x, 0)
		results.push(et)

		const mb = cleanMatrix(matrix)
		const eb = traverseBeam(V.up, mb, x, matrix.length - 1)
		results.push(eb)
	}
	// Right and left edge
	for (let y = 0; y < matrix.length; y++) {
		const mr = cleanMatrix(matrix)
		const er = traverseBeam(V.left, mr, matrix[0].length - 1, y)
		results.push(er)

		const ml = cleanMatrix(matrix)
		const el = traverseBeam(V.right, ml, 0, y)
		results.push(el)
	}
	console.log("Part 2:", Math.max(...results))
}
