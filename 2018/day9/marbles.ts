interface IGameState {
	circle: number[];
	marble: number;
	player: number;
	score: Map<number, number>;
}

interface IPlayer {
	id: number;
	score: number;
}

export class Marbles {
	private players: number;
	private marbles: number;
	private state: IGameState;

	constructor(players: number, lastMarbleWorth: number) {
		this.players = players;
		this.marbles = lastMarbleWorth;
		this.state = {
			circle: [0],
			marble: 0,
			player: 0,
			score: new Map()
		};
	}

	public play(): void {
		for (let i: number = 1; i <= this.marbles; i++) {
			if (i % 23 === 0) {
				// add to score
				let score: number = this.state.score.get(this.state.player) || 0;
				let index: number = this.state.marble - 7;
				if (index < 0) {
					index += this.state.circle.length;
				}
				let removed: number[] = this.state.circle.splice(index, 1);
				this.state.score.set(this.state.player, score + i + removed[0]);
				this.state.marble = index;
			} else {
				// add to circle
				let index: number = this.state.marble + 1;
				if (index >= this.state.circle.length) {
					index %= this.state.circle.length;
				}
				this.state.circle.splice(index, 1, this.state.circle[index], i);
				this.state.marble = index + 1;
			}
			this.state.player++;
			if (this.state.player === this.players) {
				this.state.player = 0;
			}
		}
	}

	public highscore(): IPlayer {
		let highest: IPlayer = {
			id: -1,
			score: -1
		};
		for (const [id, score] of this.state.score) {
			if (score > highest.score) {
				highest = { id, score };
			}
		}
		return highest;
	}
}
