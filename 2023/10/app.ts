import { input as inp } from "./input"

type Direction = "up" | "down" | "left" | "right"

type Point = {
	x: number
	y: number
	distance: number
	type: "ground" | "pipe"
	raw: string
	connections: Direction[] | null
}

type Area = {
	points: Point[][]
	start: Point
}

const connectionCoords = {
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
}
const opposites: Record<Direction, Direction> = {
	left: "right",
	right: "left",
	up: "down",
	down: "up",
}

function connections(char: string): Direction[] | null {
	switch (char) {
		case "|":
			return ["up", "down"]
		case "-":
			return ["left", "right"]
		case "F":
			return ["down", "right"]
		case "7":
			return ["down", "left"]
		case "J":
			return ["up", "left"]
		case "L":
			return ["up", "right"]
		case "S":
			return ["up", "down", "left", "right"]
	}
	return null
}

function parseInput(input: string): Area {
	const area: Area = {
		points: [],
		start: {
			x: -1,
			y: -1,
			distance: 0,
			type: "ground",
			connections: null,
			raw: "S",
		},
	}
	let y = 0
	for (const line of input.split("\n")) {
		area.points.push([])
		let x = 0
		for (const char of line) {
			area.points[y][x] = {
				x,
				y,
				distance: -1,
				type: char === "." ? "ground" : "pipe",
				connections: connections(char),
				raw: char,
			}
			if (char === "S") {
				area.start = area.points[y][x]
				area.start.distance = 0
			}
			x++
		}
		y++
	}
	return area
}

function validConnections(
	point: Point,
	area: Area,
	lastConnection?: Direction | null
) {
	return point.connections
		?.filter((c) => c !== lastConnection)
		.map((c) => {
			const coord = connectionCoords[c]
			const p = area.points[point.y + coord.y]?.[point.x + coord.x]
			return {
				point: p,
				direction: c,
				validConn: p?.connections?.includes(opposites[c]),
			}
		})
}

function findWire(area: Area) {
	const wire = [area.start]
	let current = area.start
	let lastConnection: Direction | null = null
	while (true) {
		const conn = validConnections(current, area, lastConnection)?.find(
			(c) => c.validConn
		)
		if (!conn) {
			console.warn("Incomplete wire", wire, "at", current)
			break
		}

		if (conn.point === area.start) {
			break
		}

		wire.push(conn.point)
		conn.point.distance = current.distance + 1
		current = conn.point
		lastConnection = opposites[conn.direction]
	}

	return wire
}

function pointsEnclosedByWire(area: Area, wire: Point[]) {
	function isPointInWire(point: Point) {
		return wire.some((p) => p.x === point.x && p.y === point.y)
	}

	const points: Point[] = []
	for (const line of area.points) {
		let inWire: boolean = false
		let lastTurn: "F" | "L" | null = null
		for (const point of line) {
			if (isPointInWire(point)) {
				switch (point.raw) {
					case "F":
					case "L":
						lastTurn = point.raw
						break
					case "7":
						if (lastTurn === "L") {
							inWire = !inWire
						}
						lastTurn = null
						break
					case "J":
						if (lastTurn === "F") {
							inWire = !inWire
						}
						lastTurn = null
						break
					case "|":
						inWire = !inWire
						lastTurn = null
						break
					default:
					// Nothing on horizontal
				}
			} else if (inWire) {
				points.push(point)
			}
		}
	}
	return points
}

function setStartRealRaw(area: Area) {
	const start = area.start
	const neighbours = validConnections(start, area)?.filter((c) => c.validConn)
	// Figure out the shape of the start
	if (neighbours?.length !== 2) {
		console.warn("Start has wrong number of neighbours", neighbours)
		return
	}
	for (const possible of ["F", "7", "J", "L", "|", "-"]) {
		if (neighbours.every((n) => connections(possible)?.includes(n.direction))) {
			start.raw = possible
			break
		}
	}
}

// function drawArea(area: Area, highlights: Point[], wire: Point[]) {
// 	function isPointInWire(point: Point) {
// 		return wire.some((p) => p.x === point.x && p.y === point.y)
// 	}

// 	const highlightChar = "█"
// 	const lines: string[] = []
// 	for (const line of area.points) {
// 		let str = ""
// 		for (const point of line) {
// 			if (highlights.includes(point)) {
// 				str += highlightChar
// 			} else if (point.type === "pipe" && !isPointInWire(point)) {
// 				str += "."
// 			} else {
// 				str += point.raw
// 			}
// 		}
// 		lines.push(str)
// 	}
// 	console.log(lines.join("\n"))
// }

const area = parseInput(inp)
setStartRealRaw(area)

const wire = findWire(area)
console.log("Part 1:", wire.length / 2)

const enclosed = pointsEnclosedByWire(area, wire)
console.log("Part 2:", enclosed.length)

// drawArea(area, enclosed, wire)
