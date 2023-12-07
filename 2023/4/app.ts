import { input as inp } from "./input"

type Game = { winningNumbers: number[]; gameNumbers: number[]; copies: number }

const cards: Game[] = inp.split("\n").map((line) => {
	const numbers = Array.from(line.matchAll(/(?:\d+|\|)(?!\d*:)/g))
	const separatorIdx = numbers.findIndex((n) => n[0] === "|")
	const winningNumbers = numbers.slice(0, separatorIdx).map((n) => +n[0])
	const gameNumbers = numbers.slice(separatorIdx + 1).map((n) => +n[0])
	return { winningNumbers, gameNumbers, copies: 1 }
})

function matchingNumbers(game: Game) {
	return game.gameNumbers.filter((n) => game.winningNumbers.includes(n))
}

function gamePoints(game: Game) {
	return Math.floor(2 ** (matchingNumbers(game).length - 1))
}

console.log(
	"Part 1:",
	cards.reduce((a, b) => a + gamePoints(b), 0)
)

console.log(
	"Part 2:",
	cards.reduce((a, b, i, games) => {
		const matches = matchingNumbers(b).length
		for (let j = 1; j <= matches && j + i < games.length; j++) {
			games[i + j].copies += b.copies
		}
		return a + b.copies
	}, 0)
)
