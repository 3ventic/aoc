import * as input from "./input"

type Point = {
	x: number
	y: number
	distanceToBeacon: number
}

type Points = {
	boundaries: Boundaries
	sensors: Map<string, Point>
}

type Boundaries = {
	minX: number
	maxX: number
	minY: number
	maxY: number
}

function parseInput(input: string): Points {
	const matches = input.matchAll(
		/Sensor at x=(\d+), y=(\d+): closest beacon is at x=(\d+), y=(\d+)/gu
	)

	const boundaries: Boundaries = {
		minX: Infinity,
		maxX: -Infinity,
		minY: Infinity,
		maxY: -Infinity,
	}
	const sensors = Array.from(matches).reduce((result, match) => {
		const x = Number(match[1])
		const y = Number(match[2])
		const distanceToBeacon =
			Math.abs(Number(match[1]) - Number(match[3])) +
			Math.abs(Number(match[2]) - Number(match[4]))
		const potentialXRange = [x - distanceToBeacon, x + distanceToBeacon]
		const potentialYRange = [y - distanceToBeacon, y + distanceToBeacon]
		if (potentialXRange[0] < boundaries.minX) {
			boundaries.minX = potentialXRange[0]
		}
		if (potentialXRange[1] > boundaries.maxX) {
			boundaries.maxX = potentialXRange[1]
		}
		if (potentialYRange[0] < boundaries.minY) {
			boundaries.minY = potentialYRange[0]
		}
		if (potentialYRange[1] > boundaries.maxY) {
			boundaries.maxY = potentialYRange[1]
		}

		result.set(`${match[1]},${match[2]}`, {
			x,
			y,
			distanceToBeacon,
		})
		return result
	}, new Map<string, Point>())

	return {
		sensors,
		boundaries,
	}
}

function coordinatesInViewOfPoints(points: Points, y: number): number {
	const coverRanges = Array.from(points.sensors.values())
		.reduce<[number, number][]>((result, point) => {
			const distance = point.distanceToBeacon - Math.abs(point.y - y)
			if (distance <= 0) {
				return result
			}
			const left = point.x - distance
			const right = point.x + distance
			result.push([left, right])
			return result
		}, [])
		.sort((a, b) => a[0] - b[0])
		.reduce<[number, number]>(
			(result, range) => {
				if (range[1] > result[1]) {
					if (range[0] === result[1]) {
						// prevent duplicate count for the endpoints of adjacent ranges
						result[0] -= 1
					}
					result[0] += range[1] + 1 - Math.max(range[0], result[1] + 1)
					result[1] = range[1]
				}
				return result
			},
			[0, points.boundaries.minX - 1]
		)
	return coverRanges[0]
}

const points = parseInput(input.input)

console.log("Part 1:", coordinatesInViewOfPoints(points, 2_000_000))
