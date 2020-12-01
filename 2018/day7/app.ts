import input from "./input";

let relationsPart1: string[][] = input.map(s => {
	let x: string[] = s.split(" ");
	return [x[1], x[7]];
});
let relationsPart2: string[][] = relationsPart1.slice();

interface IDay7 {
	answer: string;
	time: number;
}

interface IJob {
	id: string;
	time: number;
	carryOver: string[];
}

const day7: (relations: string[][], amountOfWorkers: number, timeForChar: (c: string) => number) => IDay7 = (
	relations: string[][],
	amountOfWorkers: number,
	timeForChar: (c: string) => number
) => {
	let answer: string = "";
	let time: number = 0;
	let workers: IJob[] = new Array(amountOfWorkers).fill(
		{
			id: "",
			time: Number.MAX_SAFE_INTEGER,
			carryOver: []
		},
		0,
		amountOfWorkers
	);
	let workingDropped: string[][] = [];
	let carryOver: string[] = [];
	const processAndResetWorker: (num: number) => void = (num: number) => {
		time += workers[num].time;
		answer += workers[num].id;
		carryOver = workers[num].carryOver;
		for (let i: number = 0; i < amountOfWorkers; i++) {
			if (num === i) {
				continue;
			}
			workers[i].time -= workers[num].time;
		}
		for (let i: number = 0; i < workingDropped.length; i++) {
			if (workingDropped[i][0] === workers[num].id) {
				workingDropped.splice(i, 1);
				i--;
			}
		}
		workers[num] = {
			id: "",
			time: Number.MAX_SAFE_INTEGER,
			carryOver: []
		};
	};
	const lowestWorker: () => number[] = () => {
		let time: number = Number.MAX_SAFE_INTEGER;
		let lowest: number[] = [];
		for (let i = 0; i < amountOfWorkers; i++) {
			const w: IJob = workers[i];
			if (w.time < time) {
				time = w.time;
				lowest = [i];
			} else if (w.time === time) {
				lowest.push(i);
			}
		}
		return lowest;
	};
	const processAndResetWorkers: () => number = () => {
		const lowest: number[] = lowestWorker();
		if (lowest.length === 1) {
			processAndResetWorker(lowest[0]);
			return lowest[0];
		}
		let first: number = Number.MAX_SAFE_INTEGER;
		let index: number = 0;
		for (const i of lowest) {
			const w: IJob = workers[i];
			if (w.id.length === 1 && w.id.charCodeAt(0) < first) {
				first = w.id.charCodeAt(0);
				index = i;
			}
		}
		processAndResetWorker(index);
		return index;
	};

	while (relations.length > 0) {
		let worker: number = -1;
		for (let i: number = 0; i < amountOfWorkers; i++) {
			if (workers[i].id === "") {
				worker = i;
				break;
			}
		}
		if (worker === -1) {
			worker = processAndResetWorkers();
		}
		let noRequirements: string[] = relations
			.filter(r => !relations.some(r2 => r2[1] === r[0]) && !workingDropped.some(r2 => r2[1] === r[0]))
			.map(r => r[0]);
		if (noRequirements.length === 0) {
			processAndResetWorkers();
			continue;
		}
		noRequirements.sort();
		let next: string = noRequirements[0];
		let dropped: string[][] = relations.filter(r => r[0] === next);
		relations = relations.filter(r => r[0] !== next);
		let co: string[] = dropped.filter(d => !relations.map(r => r[0]).includes(d[1])).map(d => d[1]);
		workers[worker] = {
			id: next,
			time: timeForChar(next),
			carryOver: co
		};
		workingDropped = workingDropped.concat(dropped);
	}
	while (workers.filter(w => w.id.length > 0).length !== 0) {
		processAndResetWorkers();
	}
	answer += carryOver.join("");
	time += carryOver.map(c => timeForChar(c)).reduce((r, v) => r + v, 0);

	return {
		answer: answer,
		time: time
	};
};

const part2: IDay7 = day7(relationsPart2, 5, (c: string) => c.charCodeAt(0) - "A".charCodeAt(0) + 61);

console.log("Part 1 answer:", day7(relationsPart1, 1, () => 0).answer);
console.log("Part 2 string:", part2.answer);
console.log("Part 2 answer:", part2.time);
