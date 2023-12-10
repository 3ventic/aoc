import { input as inp } from "./input"

const input = inp.split("\n").map((line) => line.split(" ").map(Number))

function extrapolate(direction: "left" | "right" = "right") {
	return (report: number[]) => {
		if (direction === "left") report = report.reverse()

		const arrs: number[][] = [report]
		let arr = 0
		for (let arr = 0; arr < arrs.length; arr++) {
			const newArr: number[] = []
			for (let i = 0; i < arrs[arr].length - 1; i++) {
				newArr.push(arrs[arr][i + 1] - arrs[arr][i])
			}
			arrs.push(newArr)
			if (newArr.every((val) => val === newArr[0])) {
				break
			}
		}

		let result = 0
		for (let i = arrs.length - 1; i >= 1; i--) {
			const curr = arrs[i]
			const next = arrs[i - 1]
			result = next[next.length - 1] + curr[curr.length - 1]
			next.push(result)
		}
		return result
	}
}

console.log(
	"Part 1:",
	input.map(extrapolate("right")).reduce((a, b) => a + b)
)
console.log(
	"Part 2:",
	input.map(extrapolate("left")).reduce((a, b) => a + b)
)
