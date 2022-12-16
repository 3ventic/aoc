import * as inputs from "./input"

type Valve = {
	name: string
	flowRate: number
	tunnels: Valve[]
}

type Valves = Map<string, Valve>

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

function findNextHighestPotentialValve(
	valve: Valve,
	stepsLeft: number,
	seen: Set<Valve>
): [number, Valve] | null {
	if (stepsLeft <= 0) {
		return null
	}
	const stepsToMove = 1
	const stepsToOpen = 1
	let stepsTaken = 0
	let highestRateValve: Valve | null = null
	let highestPotentialRelease = 0
	for (const tunnelValve of valve.tunnels) {
		if (seen.has(tunnelValve)) {
			continue
		}
		let potentialRelease =
			tunnelValve.flowRate * (stepsLeft - stepsToMove - stepsToOpen)
		if (potentialRelease > 0) {
			// console.log("POTENTIAL", tunnelValve.name, potentialRelease)
		}
		if (potentialRelease > highestPotentialRelease) {
			highestPotentialRelease = potentialRelease
			highestRateValve = tunnelValve
		}
		const innerPotential = findNextHighestPotentialValve(
			tunnelValve,
			stepsLeft - stepsToMove - stepsToOpen,
			new Set([...seen, tunnelValve])
		)
		if (!innerPotential) {
			continue
		}

		const [innerSteps, innerValve] = innerPotential
		potentialRelease =
			innerValve.flowRate * (stepsLeft - stepsToMove - stepsToOpen - innerSteps)
		if (potentialRelease > highestPotentialRelease) {
			highestPotentialRelease = potentialRelease
			highestRateValve = innerValve
			stepsTaken = innerSteps
		}
	}
	return highestRateValve
		? [stepsTaken + stepsToMove + stepsToOpen, highestRateValve]
		: null
}

function calculateMaxPotentialPressureReleased(valves: Valves): number {
	const releasedVaves = new Set<Valve>()
	let flowRate = 0
	let released = 0
	let valve = valves.values().next().value
	for (let step = 1; step <= maxSteps; ) {
		const potential = findNextHighestPotentialValve(
			valve,
			maxSteps - step - 1,
			releasedVaves
		)
		if (!potential) {
			console.log("NO POTENTIAL", step, valve.name, flowRate)
			released += flowRate
			step++
			continue
		}
		let stepsTaken
		;[stepsTaken, valve] = potential
		step += stepsTaken
		released += flowRate * stepsTaken
		flowRate += valve.flowRate
		releasedVaves.add(valve)
		console.log(
			"MOVED AND OPENED",
			valve.name,
			"in",
			stepsTaken,
			"steps for a new flowrate of",
			flowRate
		)
	}
	return released
}

const valves = parseInput(inputs.sample)

console.log(calculateMaxPotentialPressureReleased(valves))
