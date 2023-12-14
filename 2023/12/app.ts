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

function count(s: string, c: string) {
	return s.split(c).length - 1
}

function possibleArrangements(sr: SpringRecord): number {
	const deduper: number[][] = []
	const totalDefinites = count(sr.springs, "#")
	const countArrangements = (
		parts: string[],
		records: number[],
		taken: number[] = [],
		consumed: number = 0,
		definites: number = 0
	): number => {
		if (records.length === 0) {
			if (definites !== totalDefinites) {
				return 0
			}
			if (deduper.some((d) => d.every((v, i) => v === taken[i]))) {
				return 0
			}
			deduper.push(taken)
			return 1
		}

		const record = records[0]
		const nextRecords = records.slice(1)
		let total = 0
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].length < record) {
				consumed += parts[i].length
				continue
			}
			if (parts[i].length === record) {
				total += countArrangements(
					parts.slice(i + 1),
					nextRecords,
					[...taken, consumed],
					consumed + record,
					definites + count(parts[i], "#")
				)
			} else {
				for (let j = 0; j <= parts[i].length - record; j++) {
					if (parts[i][j + record] === "#") {
						continue
					}

					total += countArrangements(
						[parts[i].slice(j + record + 1), ...parts.slice(i + 1)],
						nextRecords,
						[...taken, consumed + j],
						consumed + record + j + Number(j < parts[i].length - record),
						definites + count(parts[i].slice(j, j + record), "#")
					)
					if (parts[i][j] === "#") {
						break
					}
				}
			}
			consumed += parts[i].length
		}
		return total
	}

	const c = countArrangements(
		sr.springs.split(".").filter((v) => v.length),
		sr.records
	)
	return c
}

console.log(
	"Part 1:",
	input.reduce((acc, curr) => acc + possibleArrangements(curr), 0)
)
