import { input as inp } from "./input"

const V = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
} as const

type Velocity = (typeof V)[keyof typeof V]

const opposites = new Map<Velocity, Velocity>([
	[V.up, V.down],
	[V.down, V.up],
	[V.left, V.right],
	[V.right, V.left],
])

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
		return
	}

	let pos = { x: x0, y: y0 }
	let v = v0

	for (;;) {
		let cell = m[pos.y][pos.x]
		const nextVs = nextVelocities(v, cell.value)
		const nextV = nextVs[0]

		const enteredBefore = cell.enterVelocities.includes(v)
		const enteredOpposite =
			nextVs.length === 1 &&
			cell.enterVelocities.includes(opposites.get(nextV)!)
		const cycleDetected = enteredBefore || enteredOpposite
		if (cycleDetected) {
			break
		}

		cell.enterVelocities.push(v)
		v = nextV

		if (nextVs.length > 1) {
			traverseBeam(nextVs[1], m, pos.x + nextVs[1].x, pos.y + nextVs[1].y)
		}

		pos.x += v.x
		pos.y += v.y

		if (
			pos.x < 0 ||
			pos.y < 0 ||
			pos.y >= m.length ||
			pos.x >= m[pos.y].length
		) {
			break
		}
	}
}

function nextVelocities(v: Velocity, c: string) {
	switch (c) {
		case "/":
			switch (v) {
				case V.up:
					return [V.right]
				case V.down:
					return [V.left]
				case V.left:
					return [V.down]
				case V.right:
					return [V.up]
			}
			break
		case "\\":
			switch (v) {
				case V.up:
					return [V.left]
				case V.down:
					return [V.right]
				case V.left:
					return [V.up]
				case V.right:
					return [V.down]
			}
			break
		case "-":
			if (v === V.up || v === V.down) {
				return [V.left, V.right]
			}
			break
		case "|":
			if (v === V.left || v === V.right) {
				return [V.up, V.down]
			}
			break
		default:
			break
	}
	return [v]
}

function cleanMatrix(m: Matrix) {
	for (const row of m) {
		for (const cell of row) {
			cell.enterVelocities.length = 0
		}
	}
	return m
}

function energizedCells(m: Matrix) {
	return m.map((row) => row.filter((c) => c.enterVelocities.length > 0)).flat()
}

{
	const m = cleanMatrix(matrix)
	traverseBeam(V.right, m)
	console.log("Part 1:", energizedCells(m).length)
}

{
	const results: number[] = []
	// Top and bottom edges
	for (let x = 0; x < matrix[0].length; x++) {
		const mt = cleanMatrix(matrix)
		traverseBeam(V.down, mt, x, 0)
		results.push(energizedCells(mt).length)

		const mb = cleanMatrix(matrix)
		traverseBeam(V.up, mb, x, matrix.length - 1)
		results.push(energizedCells(mb).length)
	}
	// Right and left edge
	for (let y = 0; y < matrix.length; y++) {
		const mr = cleanMatrix(matrix)
		traverseBeam(V.left, mr, matrix[0].length - 1, y)
		results.push(energizedCells(mr).length)

		const ml = cleanMatrix(matrix)
		traverseBeam(V.right, ml, 0, y)
		results.push(energizedCells(ml).length)
	}
	console.log("Part 2:", Math.max(...results))
}
