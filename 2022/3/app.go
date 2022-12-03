package main

import (
	"fmt"
	"os"
	"strings"
)

func value(c byte) int {
	valueHigherBase := byte('a') - 1
	valueLowerBase := byte('A') - 1

	if c > valueHigherBase {
		return int(c - valueHigherBase)
	} else {
		return int(c-valueLowerBase) + 26
	}
}

func main() {
	b, _ := os.ReadFile("input.txt")
	input := string(b)
	sacks := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	groupState := 0
	var badgeCandidates map[int]map[byte]int
	initCandidates := func() {
		badgeCandidates = make(map[int]map[byte]int, 3)
		for i := 0; i < 3; i++ {
			badgeCandidates[i] = make(map[byte]int, 52)
		}
	}
	initCandidates()

	markCandidate := func(candidate byte) {
		badgeCandidates[groupState][candidate] = 1
	}

	for _, sack := range sacks {
		totalLength := len(sack)
		if totalLength == 0 {
			continue
		}
		indexOfSecondHalf := totalLength / 2

		var character byte = 0
		for i := 0; i < indexOfSecondHalf; i++ {
			for j := indexOfSecondHalf; j < totalLength; j++ {
				if sack[i] == sack[j] {
					character = sack[i]
					goto out
				}
			}
		}
	out:
		part1 += value(character)

		for _, character := range sack {
			markCandidate(byte(character))
		}
		if groupState == 2 {
			for character := range badgeCandidates[0] {
				isBadge := badgeCandidates[0][character] == 1 &&
					badgeCandidates[1][character] == 1 &&
					badgeCandidates[2][character] == 1
				if isBadge {
					part2 += value(character)
					break
				}
			}
			initCandidates()
		}

		groupState += 1
		groupState %= 3
	}

	fmt.Println(part1)
	fmt.Println(part2)
}
