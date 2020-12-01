package main

import (
	"log"
	"strconv"
	"strings"
)

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

	inpu
}
