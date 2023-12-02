import { input } from "./input"

type Bag = {
	red: number
	green: number
	blue: number
}

type Game = {
	id: number
	turns: Bag[]
}

function parseInput(input: string): Game[] {
	const lines = input.split("\n")
	return lines.map((line) => {
		const [idPart, gamePart] = line.split(":")
		const id = parseInt(idPart.split(" ")[1])
		const turns = gamePart.split(";").map((turn) => {
			const colors = turn
				.split(",")
				.map((balls) => balls.trim().split(" "))
				.reduce<Bag>(
					(acc, [count, color]) => {
						acc[color] = parseInt(count)
						return acc
					},
					{
						red: 0,
						green: 0,
						blue: 0,
					}
				)
			return colors
		})
		return {
			id,
			turns: turns,
		}
	})
}

function isGamePossible(game: Game, bag: Bag) {
	for (const turn of game.turns) {
		if (turn.red > bag.red || turn.green > bag.green || turn.blue > bag.blue) {
			return false
		}
	}
	return true
}

const games = parseInput(input)

const p1Possible = games.filter((game) =>
	isGamePossible(game, {
		red: 12,
		green: 13,
		blue: 14,
	})
)

const p1 = p1Possible.reduce((acc, game) => acc + game.id, 0)

console.log("Part 1:", p1)

const p2 = games.reduce((acc, game) => {
	const minimumBag = {
		red: 0,
		green: 0,
		blue: 0,
	}
	for (const turn of game.turns) {
		minimumBag.red = Math.max(minimumBag.red, turn.red)
		minimumBag.green = Math.max(minimumBag.green, turn.green)
		minimumBag.blue = Math.max(minimumBag.blue, turn.blue)
	}
	return acc + minimumBag.red * minimumBag.green * minimumBag.blue
}, 0)

console.log("Part 2:", p2)
