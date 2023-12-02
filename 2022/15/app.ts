import * as input from "./input"

type Sensor = {
	x: number
	y: number
	distanceToBeacon: number
}

type Sensors = Sensor[]

type Range = [number, number]

function parseInput(input: string): Sensors {
	const matches = input.matchAll(
		/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/gu
	)

	const sensors = Array.from(matches).reduce<Sensors>((result, match) => {
		const x = Number(match[1])
		const y = Number(match[2])
		const distanceToBeacon =
			Math.abs(Number(match[1]) - Number(match[3])) +
			Math.abs(Number(match[2]) - Number(match[4]))

		result.push({
			x,
			y,
			distanceToBeacon,
		})
		return result
	}, [])

	return sensors
}

function rangesInRange(points: Sensors, y: number): Range[] {
	const coverRanges = points
		.reduce<Range[]>((result, point) => {
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
		.reduce<Range[]>((result, range) => {
			if (result.length === 0) {
				result.push(range)
				return result
			}
			const lastRange = result[result.length - 1]
			if (lastRange[1] >= range[0]) {
				lastRange[1] = Math.max(lastRange[1], range[1])
				return result
			}
			result.push(range)
			return result
		}, [])
	return coverRanges
}

const points = parseInput(input.input)
const rangesPart1 = rangesInRange(points, 2_000_000)
const part1 = rangesPart1.reduce((result, range) => {
	result += range[1] - range[0]
	return result
}, 0)

const part2 = { x: 0, y: 0 }
for (let i = 0; i < 4_000_000; i++) {
	const ranges = rangesInRange(points, i)
	if (ranges.length > 1) {
		part2.x = ranges[1][0] - 1
		part2.y = i
		break
	}
}

console.log("Part 1:", part1)
console.log("Part 2:", part2.x * 4_000_000 + part2.y)
