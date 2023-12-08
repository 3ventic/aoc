import { input as inp } from "./input"

type Node = { id: string; left: string; right: string }

class Instructions {
	private index = 0
	constructor(public instructions: string) {}

	public next(): string {
		if (this.index >= this.instructions.length) {
			this.index = 0
		}
		return this.instructions[this.index++]
	}
}

const inputLines = inp.split("\n")
const instructions = new Instructions(inputLines.shift()!)
inputLines.shift()
const nodes = inputLines.reduce((acc, line) => {
	const [id, left, right] = Array.from(line.matchAll(/\w{3}/g), (m) => m[0])
	acc.set(id, { id, left, right })
	return acc
}, new Map<string, Node>())

const root = nodes.get("AAA")

function traverseUntil(
	nodes: Map<string, Node>,
	instructions: Instructions,
	initialNode: Node,
	endCondition: (current: Node) => boolean
): number {
	let steps = 0
	let currentNode = initialNode
	while (!endCondition(currentNode)) {
		const next = instructions.next()
		if (next === "L") {
			currentNode = nodes.get(currentNode.left)!
		} else if (next === "R") {
			currentNode = nodes.get(currentNode.right)!
		}
		steps++
	}
	return steps
}

if (root) {
	const part1 = traverseUntil(
		nodes,
		instructions,
		root,
		(node) => node.id === "ZZZ"
	)

	console.log("Part 1:", part1)
}

// Part 2
const roots = Array.from(nodes.keys()).filter((id) => id.endsWith("A"))
const cycleLengths = roots.map((root) =>
	traverseUntil(nodes, instructions, nodes.get(root)!, (node) =>
		node.id.endsWith("Z")
	)
)

function findFactors(n: number) {
	const factors: number[] = []
	for (let i = 2; i <= n; i++) {
		while (n % i === 0) {
			factors.push(i)
			n /= i
		}
	}
	return factors
}

const factors = Array.from(
	cycleLengths.flatMap(findFactors).reduce((acc, factor) => {
		acc.add(factor)
		return acc
	}, new Set<number>())
)

console.log(
	"Part 2:",
	factors.reduce((acc, factor) => acc * factor, 1)
)
