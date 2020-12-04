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
)

var (
	requiredFields = []string{birthYear, issueYear, expirationYear, height, hair, eye, id}
	hairMatcher    = regexp.MustCompile("^#[0-9a-f]{6}$")
	idMatcher      = regexp.MustCompile("^[0-9]{9}$")
)

type passport map[string]string

func between(value string, min, max int) bool {
	num, _ := strconv.Atoi(value)
	return num >= min && num <= max
}

func main() {
	pps := parsePassports(input)
	fieldsPresent, fieldsValidated := validatePassports(pps)

	log.Printf("Star 1: %d", fieldsPresent)
	log.Printf("Star 2: %d", fieldsValidated)
}

func validatePassports(pps []passport) (fieldsPresent int, fieldsValidated int) {
	for _, pp := range pps {
		present := true
		validated := true
		for _, field := range requiredFields {
			if value, ok := pp[field]; ok {
				switch field {
				case birthYear:
					if !between(value, 1920, 2002) {
						validated = false
					}
				case issueYear:
					if !between(value, 2010, 2020) {
						validated = false
					}
				case expirationYear:
					if !between(value, 2020, 2030) {
						validated = false
					}
				case height:
					if val := strings.TrimSuffix(value, "cm"); val != value {
						if !between(val, 150, 193) {
							validated = false
						}
					} else if val := strings.TrimSuffix(value, "in"); val != value {
						if !between(val, 59, 76) {
							validated = false
						}
					} else {
						validated = false
					}
				case hair:
					if !hairMatcher.Match([]byte(value)) {
						validated = false
					}
				case eye:
					switch value {
					case "amb", "blu", "brn", "gry", "grn", "hzl", "oth":
					default:
						validated = false
					}
				case id:
					if !idMatcher.Match([]byte(value)) {
						validated = false
					}
				}
			} else {
				present = false
			}
		}
		if present {
			fieldsPresent++
		}
		if validated && present {
			fieldsValidated++
		}
	}
	return
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
