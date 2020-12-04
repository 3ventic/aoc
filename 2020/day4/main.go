package main

import (
	"log"
	"regexp"
	"strconv"
	"strings"
)

const (
	birthYear      = "byr"
	issueYear      = "iyr"
	expirationYear = "eyr"
	height         = "hgt"
	hair           = "hcl"
	eye            = "ecl"
	id             = "pid"
	country        = "cid"
)

var requiredFields = []string{birthYear, issueYear, expirationYear, height, hair, eye, id}

type passport map[string]string

func between(value string, min, max int) bool {
	num, _ := strconv.Atoi(value)
	return num >= min && num <= max
}

func main() {
	pps := parsePassports(input)
	valid := 0
	lesser := 0
	for _, pp := range pps {
		v := true
		l := true
		for _, field := range requiredFields {
			if value, ok := pp[field]; ok {
				switch field {
				case birthYear:
					if !between(value, 1920, 2002) {
						l = false
					}
				case issueYear:
					if !between(value, 2010, 2020) {
						l = false
					}
				case expirationYear:
					if !between(value, 2020, 2030) {
						l = false
					}
				case height:
					if val := strings.TrimSuffix(value, "cm"); val != value {
						if !between(val, 150, 193) {
							l = false
						}
					} else if val := strings.TrimSuffix(value, "in"); val != value {
						if !between(val, 59, 76) {
							l = false
						}
					} else {
						l = false
					}
				case hair:
					m, _ := regexp.Match("^#[0-9a-f]{6}$", []byte(value))
					if !m {
						l = false
					}
				case eye:
					switch value {
					case "amb", "blu", "brn", "gry", "grn", "hzl", "oth":
					default:
						l = false
					}
				case id:
					m, _ := regexp.Match("^[0-9]{9}$", []byte(value))
					if !m {
						l = false
					}
				}
			} else {
				v = false
			}
		}
		if v {
			valid++
		}
		if l && v {
			lesser++
		}
	}
	log.Print(valid)
	log.Print(lesser)
}

func parsePassports(in string) []passport {
	inputs := strings.Split(in, "\n")
	pps := make([]passport, 0, len(inputs))
	pp := passport{}
	for _, input := range inputs {
		if input == "" {
			pps = append(pps, pp)
			pp = passport{}
		} else {
			props := strings.Split(input, " ")
			for _, prop := range props {
				vals := strings.Split(prop, ":")
				pp[vals[0]] = vals[1]
			}
		}
	}
	return pps
}
