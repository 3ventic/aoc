import { input } from "./input"

const inputArray = input.split("\n")

const digitWords = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
}

function getCalibrationValues(includeWords: boolean) {
	const calibrationValues: number[] = []
	inputArray.forEach((value) => {
		const valueArray = Array.from(value).reduce<number[]>((acc, c, i, arr) => {
			if (includeWords) {
				for (const [key, val] of Object.entries(digitWords)) {
					if (arr.slice(i).join("").startsWith(key)) {
						acc.push(val)
						return acc
					}
				}
			}
			const num = parseInt(c)
			if (num) {
				acc.push(num)
			}
			return acc
		}, [])
		const revArray = [...valueArray].reverse()
		if (valueArray.length > 0) {
			calibrationValues.push(valueArray[0] * 10 + revArray[0])
		}
	})
	return calibrationValues
}

console.log(
	"Part 1:",
	getCalibrationValues(false).reduce((a, b) => a + b, 0)
)
console.log(
	"Part 2:",
	getCalibrationValues(true).reduce((a, b) => a + b, 0)
)
