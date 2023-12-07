import { input as inp } from "./input"

const rows = inp.split("\n")
const times = rows[0].split(/\s+/).slice(1).map(Number)
const distances = rows[1].split(/\s+/).slice(1).map(Number)

function distanceTraveled(time: number, hold: number) {
	const holdVelocity = 1
	const timeLeft = time - hold
	return holdVelocity * hold * timeLeft
}

function waysToWin(time: number, distanceToBeat: number) {
	let wins = 0
	for (let hold = 0; hold < time; hold++) {
		const distance = distanceTraveled(time, hold)
		if (distance > distanceToBeat) {
			wins++
		} else if (wins > 0) {
			break
		}
	}
	return wins
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
