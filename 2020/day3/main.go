package main

import (
	"log"
	"strings"
)

func main() {
	log.Printf("Star 1: %d", treesOnPath(3, 1))
	log.Printf("Star 2: %d", treesOnPath(1, 1)*treesOnPath(3, 1)*treesOnPath(5, 1)*treesOnPath(7, 1)*treesOnPath(1, 2))
}

func treesOnPath(stepsRight int, stepsDown int) (trees int) {
	board := strings.Split(input, "\n")
	width := len(board[0])
	for top, left := stepsDown, stepsRight; top < len(board); top, left = top+stepsDown, left+stepsRight {
		left = ensureWithin(left, width)
		if board[top][left] == '#' {
			trees++
		}
	}
	return
}

func ensureWithin(i, max int) (x int) {
	x = i
	if x < 0 {
		x += max
	} else if x >= max {
		x -= max
	}
	return
}
