package main

import (
	"log"
	"strconv"
	"strings"
)

type criteria struct {
	one    int
	two    int
	letter rune
}

type password struct {
	criteria criteria
	password string
}

func main() {
	pws := parseInput(input)
	validPart1 := 0
	validPart2 := 0
	for _, pw := range pws {
		// part 1
		occs := 0
		for _, c := range pw.password {
			if c == pw.criteria.letter {
				occs++
			}
		}
		if occs >= pw.criteria.one && occs <= pw.criteria.two {
			validPart1++
		}
		// part 2
		valid := false
		if nthRune(pw.password, pw.criteria.one-1) == pw.criteria.letter {
			valid = !valid
		}
		if nthRune(pw.password, pw.criteria.two-1) == pw.criteria.letter {
			valid = !valid
		}
		if valid {
			validPart2++
		}
	}
	log.Printf("Star 1: %d", validPart1)
	log.Printf("Star 2: %d", validPart2)
}

func parseInput(in string) []password {
	entries := strings.Split(in, "\n")
	passwords := make([]password, len(entries))
	for i, entry := range entries {
		entryParts := strings.Split(entry, ": ")
		criteriaParts := strings.Split(entryParts[0], " ")
		occs := strings.Split(criteriaParts[0], "-")
		min, _ := strconv.Atoi(occs[0])
		max, _ := strconv.Atoi(occs[1])
		passwords[i] = password{
			password: entryParts[1],
			criteria: criteria{
				one:    min,
				two:    max,
				letter: firstRune(criteriaParts[1]),
			},
		}
	}
	return passwords
}

func firstRune(s string) rune {
	return nthRune(s, 0)
}

func nthRune(s string, index int) rune {
	for i, c := range s {
		if i == index {
			return c
		}
	}
	return '\ufdfd'
}
