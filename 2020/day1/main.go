package main

import (
	"log"
	"sort"
	"strconv"
	"strings"
)

const sumTarget = 2020

func main() {
	inputs := strings.Split(input, "\n")
	inputNums := make([]int, len(inputs))
	var err error
	for i := range inputs {
		inputNums[i], err = strconv.Atoi(inputs[i])
		if err != nil {
			log.Fatal(err)
		}
	}

	sort.Ints(inputNums)

	parts, _ := findSumParts(inputNums, 2, sumTarget, 0)
	log.Printf("Star 1: %d * %d = %d", parts[0], parts[1], parts[0]*parts[1])
	parts, _ = findSumParts(inputNums, 3, sumTarget, 0)
	log.Printf("Star 2: %d * %d * %d = %d", parts[0], parts[1], parts[2], parts[0]*parts[1]*parts[2])
}

func findSumParts(nums []int, parts int, target int, higherSum int) ([]int, bool) {
	switch parts {
	case 1:
		for _, i := range nums {
			if i+higherSum == target {
				return []int{i}, true
			}
		}
	default:
		for _, i := range nums {
			s, ok := findSumParts(nums, parts-1, target, i+higherSum)
			if ok {
				return append(s, i), true
			}
		}
	}
	return nil, false
}
