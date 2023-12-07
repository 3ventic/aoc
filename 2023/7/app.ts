import { input as inp } from "./input"

type Hand = {
	normalCards: number[]
	jokerCards: number[]
	bid: number
	normalValue: number
	jokerValue: number
}

const cardValues = {
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14,
}

function parseHand(str: string): Hand {
	const [cards, bid] = str.split(" ")
	const hand = cards.split("").map((c) => cardValues[c] || Number(c))
	const jokerHand = hand.map((c) => (c === 11 ? 1 : c))
	return {
		normalCards: hand,
		jokerCards: jokerHand,
		bid: Number(bid),
		normalValue: handValue(hand),
		jokerValue: handValue(jokerHand),
	}
}

function handValue(cards: number[]) {
	const counts = new Map<number, number>()
	let jokers = 0
	for (const card of cards) {
		const count = counts.get(card) || 0
		if (card === 1) {
			jokers++
			continue
		}
		counts.set(card, count + 1)
	}
	if (jokers === 5) {
		return 8
	}
	const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
	let [, count] = sorted[0]
	count += jokers
	if (count === 5) {
		return 8
	}
	if (count === 4) {
		return 7
	}
	if (count === 3) {
		if (sorted[1][1] === 2) {
			return 6
		}
		return 3
	}
	if (count === 2) {
		if (sorted[1][1] === 2) {
			return 2
		}
		return 1
	}
	if (count === 1) {
		return 0
	}
	return -1
}

function compareHands(type: "normal" | "joker") {
	const values = `${type}Value`
	const cards = `${type}Cards`
	return (a: Hand, b: Hand) => {
		if (a[values] > b[values]) {
			return 1
		}
		if (a[values] < b[values]) {
			return -1
		}
		for (let i = 0; i < a[cards].length; i++) {
			if (a[cards][i] > b[cards][i]) {
				return 1
			}
			if (a[cards][i] < b[cards][i]) {
				return -1
			}
		}
		return 0
	}
}

const hands = inp.split("\n").map(parseHand)

const sorted = hands.sort(compareHands("normal"))

console.log(
	"Part 1:",
	sorted.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0)
)

const jokerSorted = hands.sort(compareHands("joker"))

console.log(
	"Part 2:",
	jokerSorted.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0)
)
