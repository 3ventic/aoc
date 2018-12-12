export const state: string[] = Array.from(
	`#..####.##..#.##.#..#.....##..#.###.#..###....##.##.#.#....#.##.####.#..##.###.#.......#............`
);
export const rules: string[] = `##... => .
##.## => .
.#.#. => #
#..#. => .
#.### => #
.###. => .
#.#.. => .
##..# => .
..... => .
...#. => .
.#..# => .
####. => #
...## => #
..### => #
#.#.# => #
###.# => #
#...# => #
..#.# => .
.##.. => #
.#... => #
.##.# => #
.#### => .
.#.## => .
..##. => .
##.#. => .
#.##. => .
#..## => .
###.. => .
....# => .
##### => #
#.... => .
..#.. => #`.split("\n");