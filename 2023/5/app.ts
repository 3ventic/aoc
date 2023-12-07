import { input as inp } from "./input"

type SeedMaps = {
	seedToSoil: RangeData[]
	soilToFert: RangeData[]
	fertToWater: RangeData[]
	waterToLight: RangeData[]
	lightToTemp: RangeData[]
	tempToHumid: RangeData[]
	humidToLocation: RangeData[]
}

type RangeData = {
	destination: number
	source: number
	range: number
}

type SeedData = {
	seeds: number[]
	maps: SeedMaps
}

type Seed = {
	id: number
	soil: number
	fert: number
	water: number
	light: number
	temp: number
	humid: number
	location: number
}

type ValueRange = {
	min: number
	len: number
}

function parseMaps(input: string): SeedData {
	const lines = input.split("\n").map((l) => l.trim())
	let state: keyof SeedMaps | null = null

	let seeds: number[] = []
	const sm: SeedMaps = {
		seedToSoil: [],
		soilToFert: [],
		fertToWater: [],
		waterToLight: [],
		lightToTemp: [],
		tempToHumid: [],
		humidToLocation: [],
	}

	for (const line of lines) {
		if (line.length === 0) {
			state = null
			continue
		}
		if (line.startsWith("seeds: ")) {
			state = null
			const numbers = line.split(" ").slice(1).map(Number)
			seeds = numbers
			continue
		}
		switch (line) {
			case "seed-to-soil map:":
				state = "seedToSoil"
				continue
			case "soil-to-fertilizer map:":
				state = "soilToFert"
				continue
			case "fertilizer-to-water map:":
				state = "fertToWater"
				continue
			case "water-to-light map:":
				state = "waterToLight"
				continue
			case "light-to-temperature map:":
				state = "lightToTemp"
				continue
			case "temperature-to-humidity map:":
				state = "tempToHumid"
				continue
			case "humidity-to-location map:":
				state = "humidToLocation"
				continue
		}

		if (!state) {
			console.warn("Unexpected line in seeds section: ", line)
			continue
		}

		const [dest, src, range] = line.split(" ").map(Number)
		const rangeData = { destination: dest, source: src, range: range }

		if (sm[state].length === 0) {
			sm[state].push(rangeData)
		} else if (sm[state][0].source > src) {
			sm[state].unshift(rangeData)
		} else {
			// Insert in sorted order
			let i = 0
			while (i < sm[state].length && sm[state][i].source < src) {
				i++
			}
			sm[state].splice(i, 0, rangeData)
		}
	}

	return {
		seeds: seeds,
		maps: sm,
	}
}

function mapValue(value: number, maps: RangeData[]): number {
	const firstTooHigh = maps.findIndex((r) => r.source > value)
	let mapIndex = 0
	if (firstTooHigh === -1) {
		mapIndex = maps.length - 1
	} else if (firstTooHigh === 0) {
		return value
	} else {
		mapIndex = firstTooHigh - 1
	}

	const { destination, source, range } = maps[mapIndex]
	const diff = value - source
	if (diff >= range) {
		return value
	}

	return destination + diff
}

export function mapValueRange(
	range: ValueRange,
	maps: RangeData[]
): ValueRange[] {
	const ranges: ValueRange[] = []
	const mappedRanges: ValueRange[] = []
	let r = structuredClone(range)
	ranges.push(r)

	for (const map of maps) {
		let skips = 0
		for (let i = 0; i < ranges.length - skips; i++) {
			const rr = ranges[i]

			if (rr.len === 0) {
				continue
			}
			if (map.source > rr.min + rr.len) {
				continue
			}
			if (map.source + map.range < rr.min) {
				continue
			}

			const start = Math.max(map.source, rr.min)
			const end = Math.min(map.source + map.range, rr.min + rr.len)
			const len = end - start
			const left = start - rr.min
			const right = rr.len - len - left

			rr.len = left
			mappedRanges.push({
				min: map.destination + (rr.min - map.source),
				len: len,
			})
			if (right > 0) {
				ranges.push({ min: end, len: right })
				skips++
			}
		}
	}

	return ranges.filter((v) => v.len).concat(mappedRanges)
}

function mapSeed(seed: number, maps: SeedMaps): Seed {
	const soil = mapValue(seed, maps.seedToSoil)
	const fert = mapValue(soil, maps.soilToFert)
	const water = mapValue(fert, maps.fertToWater)
	const light = mapValue(water, maps.waterToLight)
	const temp = mapValue(light, maps.lightToTemp)
	const humid = mapValue(temp, maps.tempToHumid)
	const location = mapValue(humid, maps.humidToLocation)

	return {
		id: seed,
		soil: soil,
		fert: fert,
		water: water,
		light: light,
		temp: temp,
		humid: humid,
		location: location,
	}
}

function mapSeeds(seeds: number[], maps: SeedMaps): Seed[] {
	return seeds.map((s) => mapSeed(s, maps))
}

const sd = parseMaps(inp)
const seeds = mapSeeds(sd.seeds, sd.maps)

console.log(
	"Part 1:",
	seeds.reduce((r, s) => (s.location < r ? s.location : r), Number.MAX_VALUE)
)

const seedRanges: ValueRange[] = []
for (let i = 0; i < sd.seeds.length; i += 2) {
	seedRanges.push({ min: sd.seeds[i], len: sd.seeds[i + 1] })
}

const soilRanges = seedRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.seedToSoil)
)
const fertRanges = soilRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.soilToFert)
)
const waterRanges = fertRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.fertToWater)
)
const lightRanges = waterRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.waterToLight)
)
const tempRanges = lightRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.lightToTemp)
)
const humidRanges = tempRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.tempToHumid)
)
const locationRanges = humidRanges.flatMap((r) =>
	mapValueRange(r, sd.maps.humidToLocation)
)

console.log(
	"Part 2:",
	locationRanges.reduce((r, s) => (s.min < r ? s.min : r), Number.MAX_VALUE)
)
