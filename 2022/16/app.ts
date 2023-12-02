import * as inputs from "./input"
import { permute } from "./stackoverflow"

type Valve = {
	name: string
	flowRate: number
	tunnels: Valve[]
}

type Valves = Map<string, Valve>

type Candidate = {
	valve: Valve
	distance: number
	potential: number
}

const maxSteps = 30

const parseInput = (input: string): Valves => {
	const valves = new Map<string, Valve>()
	input.split("\n").forEach((line) => {
		const regex =
			/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (\w+(?:, \w+)*)/
		const match = line.match(regex)
		if (!match) {
			throw new Error(`Invalid input: ${line}`)
		}
		const [, name, flowRate, tunnels] = match
		const seen = new Set<Valve>()
		let valve = valves.get(name)
		if (!valve) {
			valve = {
				name,
				flowRate: parseInt(flowRate),
				tunnels: [],
			}
			valves.set(name, valve)
		} else {
			valve.flowRate = parseInt(flowRate)
		}
		for (const tunnel of tunnels.split(", ")) {
			const tunnelValve = valves.get(tunnel)
			if (!tunnelValve) {
				const innerTunnel: Valve = {
					name: tunnel,
					flowRate: 0,
					tunnels: [],
				}
				valve.tunnels.push(innerTunnel)
				valves.set(tunnel, innerTunnel)
			} else {
				valve.tunnels.push(tunnelValve)
			}
		}
	})
	return valves
}

function potentialRelease(flowRate: number, stepsLeft: number): number {
	return flowRate * stepsLeft
}

function minimumDistanceToValve(
	valve: Valve,
	targetValve: Valve,
	seen: Set<Valve> = new Set([valve])
): number {
	if (valve === targetValve) {
		return 0
	}
	return Math.min(
		...valve.tunnels
			.filter((tunnel) => {
				if (seen.has(tunnel)) {
					return false
				}
				seen.add(tunnel)
				return true
			})
			.map((tunnel) => 1 + minimumDistanceToValve(tunnel, targetValve, seen))
	)
}

function calculateMaxPotentialPressureReleased(allValves: Valves): number {
	const start = allValves.values().next().value
	// return (function inner(start: Valve, nexts: Valve[]): number {
	// 	if (nexts.length === 0) {
	// 		return 0
	// 	}
	// 	// Evaluate all possible orders of nexts and return the maximum
	// 	return Math.max(
	// 		...nexts.map((next, index) => {
	// 			const nextNexts = [...nexts]
	// 			nextNexts.splice(index, 1)
	// 			return (
	// 				potentialRelease(next.flowRate, minimumDistanceToValve(start, next)) +
	// 				inner(next, nextNexts)
	// 			)
	// 		})
	// 	)
	// })(
	// 	start,
	// 	[...allValves.values()].filter((valve) => valve.flowRate)
	// )
	const flowValves = [...allValves.values()].filter((valve) => valve.flowRate)
	console.log(flowValves.length)
	// permute(flowValves).map((vs) => console.log(vs.map((v) => v.name)))
	return 0
}

const valves = parseInput(inputs.input)

console.log(
	permute(Array.from(valves.values()).slice(0, 11)).map((vs) =>
		vs.map((v) => v.name)
	)
)

console.log(calculateMaxPotentialPressureReleased(valves))
