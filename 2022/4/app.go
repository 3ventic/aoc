package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parseRange(r string) (int, int) {
	// range is a pair of integers separated by a dash
	pair := strings.Split(r, "-")
	start, _ := strconv.Atoi(pair[0])
	end, _ := strconv.Atoi(pair[1])
	return start, end
}

func main() {
	b, _ := os.ReadFile("input.txt")
	input := string(b)
	// pairs contains two ranges given as x-y, where x and y are integers, separated by a comma
	pairs := strings.Split(input, "\n")

	part1 := 0
	part2 := 0
	validPairs := 0

	for _, pair := range pairs {
		if len(pair) == 0 {
			continue
		}
		validPairs++

		elfs := strings.Split(pair, ",")
		start, end := parseRange(elfs[0])
		start2, end2 := parseRange(elfs[1])
		if start2 >= start && end2 <= end || start >= start2 && end <= end2 {
			part1++
		} else if start2 > end || end2 < start {
			part2++
		}
	}
	part2 = validPairs - part2

	fmt.Println(part1)
	fmt.Println(part2)
}
