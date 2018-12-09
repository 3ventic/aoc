import input from "./input";
import { Marbles } from "./marbles";

const [players, points]: number[] = input
	.split(" ")
	.filter(v => /^\d+/.test(v))
	.map(v => parseInt(v, 10));
const game: Marbles = new Marbles(players, points);
game.play();

console.log("Part 1 answer:", game.highscore());

const gamePart2: Marbles = new Marbles(players, points * 100);
gamePart2.play();

console.log("Part 2 answer:", gamePart2.highscore());
