import { input as inp } from "./input"

type SpringRecord = {
	springs: string
	records: number[]
}

const input = inp.split("\n").map((line) => {
	const [sp, re] = line.split(" ")
	const records = re.split(",").map(Number)
	const springs = sp
	return {
		springs,
		records,
	}
})

function memoize<Args extends unknown[], Result>(
	func: (...args: Args) => Result
): (...args: Args) => Result {
	const stored = new Map<string, Result>()

	return (...args) => {
		const k = JSON.stringify(args)
		if (stored.has(k)) {
			return stored.get(k)!
		}
		const result = func(...args)
		stored.set(k, result)
		return result
	}
}

const possibleArrangements = memoize((springs: string, records: number[]) => {
	if (springs.length === 0) {
		return Number(records.length === 0)
	}

	if (records.length === 0) {
		return Number(!springs.includes("#"))
	}

	const totalLength = records.reduce((acc, curr) => acc + curr, 0)
	if (springs.length < totalLength + records.length - 1) {
		// Line is too short to contain the rest of the records
		return 0
	}

	if (springs[0] === ".") {
		return possibleArrangements(springs.slice(1), records)
	}

	if (springs[0] === "#") {
		const [record, ...newRecords] = records
		if (springs[record] === "#") {
			return 0
		}
		for (let i = 0; i < record; i++) {
			if (springs[i] === ".") {
				return 0
			}
		}

		return possibleArrangements(springs.slice(record + 1), newRecords)
	}

	return (
		possibleArrangements("#" + springs.slice(1), records) +
		possibleArrangements("." + springs.slice(1), records)
	)
})

function repeat(s: string, n: number, join: string = "") {
	let r = ""
	for (let i = 0; i < n; i++) {
		r += s + join
	}
	return r.slice(0, -1)
}

function unfold(sr: SpringRecord, n: number = 5) {
	sr = structuredClone(sr)
	sr.springs = repeat(sr.springs, n, "?")
	const originalRecords = [...sr.records]
	for (let i = 0; i < n - 1; i++) {
		originalRecords.forEach((r) => sr.records.push(r))
	}
	return sr
}

console.log(
	"Part 1:",
	input.reduce(
		(acc, curr) => acc + possibleArrangements(curr.springs, curr.records),
		0
	)
)

console.log(
	"Part 2:",
	input.reduce((acc, curr) => {
		const unfolded = unfold(curr)
		return acc + possibleArrangements(unfolded.springs, unfolded.records)
	}, 0)
)
