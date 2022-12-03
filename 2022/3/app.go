package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	b, _ := os.ReadFile("input.txt")
	input := string(b)
	sacks := strings.Split(input, "\n")

	valueHigherBase := byte('a') - 1
	valueLowerBase := byte('A') - 1

	value := func(c byte) int {
		if c > valueHigherBase {
			return int(c - valueHigherBase)
		} else {
			return int(c-valueLowerBase) + 26
		}
	}

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
		l := len(sack)
		if l == 0 {
			continue
		}
		s := l / 2

		var c byte = 0
		for i := 0; i < s; i++ {
			for j := s; j < l; j++ {
				if sack[i] == sack[j] {
					c = sack[i]
					goto out
				}
			}
		}
	out:
		part1 += value(c)

		for _, c := range sack {
			markCandidate(byte(c))
		}
		if groupState == 2 {
			for k, v := range badgeCandidates[0] {
				if v == 1 && badgeCandidates[1][k] == 1 && badgeCandidates[2][k] == 1 {
					part2 += value(k)
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
