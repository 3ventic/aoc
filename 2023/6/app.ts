import { input as inp } from "./input"

const rows = inp.split("\n")
const times = rows[0].split(/\s+/).slice(1).map(Number)
const distances = rows[1].split(/\s+/).slice(1).map(Number)

function waysToWin(time: number, distanceToBeat: number) {
	const lower = (-time + (time ** 2 - 4 * distanceToBeat) ** 0.5) / 2
	const upper = (-time - (time ** 2 - 4 * distanceToBeat) ** 0.5) / 2

	return Math.abs(Math.ceil(upper) - Math.floor(lower) - 1)
}

const wins: number[] = []
for (let i = 0; i < times.length; i++) {
	const distanceToBeat = distances[i]
	const time = times[i]
	wins.push(waysToWin(time, distanceToBeat))
}

console.log(
	"Part 1:",
	wins.reduce((a, b) => a * b, 1)
)

const time = Number(rows[0].split(/\D+/).join(""))
const distance = Number(rows[1].split(/\D+/).join(""))

console.log("Part 2:", waysToWin(time, distance))
