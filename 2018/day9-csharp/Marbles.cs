using System.Collections.Generic;

namespace day9
{
	class Marbles
	{
		int players;
		int player = 0;
		int marbles;
		Marble marble;
		Dictionary<int, long> score = new Dictionary<int, long>();

		public Marbles(int players, int marbles)
		{
			this.players = players;
			this.marbles = marbles;
			marble = new Marble()
			{
				Value = 0
			};
			marble.Previous = marble;
			marble.Next = marble;
		}

		public void Play()
		{
			for (int i = 1; i <= this.marbles; i++)
			{
				if (i % 23 == 0)
				{
					// add to score
					long score = this.score.TryGetValue(this.player, out score) ? score : 0;
					score += i;
					for (int j = 0; j < 7; j++)
					{
						this.marble = this.marble.Previous;
					}
					score += this.marble.Value;
					this.score[this.player] = score;

					// Remove marble
					this.marble.Previous.Next = this.marble.Next;
					this.marble.Next.Previous = this.marble.Previous;
					this.marble = this.marble.Next;
				}
				else
				{
					// add to circle
					for (int j = 0; j < 1; j++)
					{
						this.marble = this.marble.Next;
					}
					Marble m = new Marble()
					{
						Previous = this.marble,
							Next = this.marble.Next,
							Value = i
					};
					this.marble.Next.Previous = m;
					this.marble.Next = m;
					this.marble = m;
				}
				this.player++;
				if (this.player == this.players)
				{
					this.player = 0;
				}
			}
		}

		public(int Player, long Score) Highscore()
		{
			(int, long Value) top = (-1, -1);
			foreach (var kv in this.score)
			{
				if (kv.Value > top.Value)
				{
					top = (kv.Key, kv.Value);
				}
			}
			return top;
		}
	}
}
