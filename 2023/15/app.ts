import { input as inp } from "./input"

const input = inp.split(",")

function hash(s: string) {
	return s.split("").reduce((acc, curr) => {
		acc += curr.charCodeAt(0)
		acc *= 17
		acc %= 256
		return acc
	}, 0)
}

console.log(
	"Part 1:",
	input.map(hash).reduce((acc, curr) => acc + curr, 0)
)

type Lens = {
	name: string
	focalLength: number
}

type Box = {
	id: number
	lenses: Lens[]
}

type Instruction = {
	lens: string
	hash: number
} & (
	| {
			type: "set"
			focalLength: number
	  }
	| {
			type: "remove"
	  }
)

const boxes: Box[] = []
for (let i = 0; i < 256; i++) {
	boxes.push({
		id: i + 1,
		lenses: [],
	})
}

function parseInstruction(s: string) {
	const [lens, type, length] = s.split(/\b/g)
	if (type === "=") {
		return {
			type: "set",
			lens,
			hash: hash(lens),
			focalLength: parseInt(length),
		} satisfies Instruction
	}
	return {
		type: "remove",
		lens,
		hash: hash(lens),
	} satisfies Instruction
}

const instructions = input.map(parseInstruction)

for (const ins of instructions) {
	const box = boxes[ins.hash]
	if (ins.type === "set") {
		const existing = box.lenses.find((l) => l.name === ins.lens)
		if (existing) {
			existing.focalLength = ins.focalLength
			continue
		}
		box.lenses.push({
			name: ins.lens,
			focalLength: ins.focalLength,
		})
	} else {
		box.lenses = box.lenses.filter((l) => l.name !== ins.lens)
	}
}

function focusingPower(box: Box) {
	return box.lenses.reduce(
		(acc, curr, i) => acc + curr.focalLength * box.id * (i + 1),
		0
	)
}

console.log(
	"Part 2:",
	boxes.map(focusingPower).reduce((acc, curr) => acc + curr, 0)
)
