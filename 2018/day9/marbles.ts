interface IMarble {
	previous: IMarble;
	next: IMarble;
	value: number;
}

interface IPlayer {
	id: number;
	score: number;
}

export class Marbles {
	private players: number;
	private player: number = 0;
	private marbles: number;
	private score: Map<number, number>;
	private marble: IMarble;

	constructor(players: number, lastMarbleWorth: number) {
		this.players = players;
		this.marbles = lastMarbleWorth;
		this.score = new Map();
		this.marble = {
			previous: this.marble,
			next: this.marble,
			value: 0
		};
		this.marble.previous = this.marble;
		this.marble.next = this.marble;
	}

	public play(): void {
		for (let i: number = 1; i <= this.marbles; i++) {
			if (i % 23 === 0) {
				// add to score
				let score: number = this.score.get(this.player) || 0;
				score += i;
				for (const _ of new Array(7)) {
					this.marble = this.marble.previous;
				}
				score += this.marble.value;
				this.score.set(this.player, score);

				this.marble.previous.next = this.marble.next;
				this.marble.next.previous = this.marble.previous;
				this.marble = this.marble.next;
			} else {
				// add to circle
				for (const _ of new Array(1)) {
					this.marble = this.marble.next;
				}
				const m: IMarble = {
					previous: this.marble,
					next: this.marble.next,
					value: i
				};
				this.marble.next.previous = m;
				this.marble.next = m;
				this.marble = m;
			}
			this.player++;
			if (this.player === this.players) {
				this.player = 0;
			}
		}
	}

	public highscore(): IPlayer {
		let highest: IPlayer = {
			id: -1,
			score: -1
		};
		for (const [id, score] of this.score) {
			if (score > highest.score) {
				highest = { id, score };
			}
		}
		return highest;
	}
}
