import input from "./input";

enum Direction {
	Up,
	Down,
	Left,
	Right
}

enum RailDirection {
	None,
	Vertical,
	Horizontal,
	Intersection,
	SlantedRightCorner,
	SlantedLeftCorner
}

type Cart = {
	direction: Direction;
	x: number;
	y: number;
	intersections: number;
	lastMove: number;
};

type Rail = {
	cart: Cart | null;
	direction: RailDirection;
};

function parseRailmap(input: string): Rail[][] {
	const rails: Rail[][] = [];
	const rows: string[] = input.split("\n");
	for (let y: number = 0; y < rows.length; y++) {
		const row: string[] = Array.from(rows[y]);
		rails.push(
			row.map((c, x) => {
				switch (c) {
					// missed edge-case: carts starting in an intersection
					case "-":
						return {
							cart: null,
							direction: RailDirection.Horizontal
						};
					case "|":
						return {
							cart: null,
							direction: RailDirection.Vertical
						};
					case "+":
						return {
							cart: null,
							direction: RailDirection.Intersection
						};
					case "/":
						return {
							cart: null,
							direction: RailDirection.SlantedRightCorner
						};
					case "\\":
						return {
							cart: null,
							direction: RailDirection.SlantedLeftCorner
						};
					case "^":
						return {
							cart: { x, y, direction: Direction.Up, intersections: 0, lastMove: -1 },
							direction: RailDirection.Vertical
						};
					case "v":
						return {
							cart: { x, y, direction: Direction.Down, intersections: 0, lastMove: -1 },
							direction: RailDirection.Vertical
						};
					case "<":
						return {
							cart: { x, y, direction: Direction.Left, intersections: 0, lastMove: -1 },
							direction: RailDirection.Horizontal
						};
					case ">":
						return {
							cart: { x, y, direction: Direction.Right, intersections: 0, lastMove: -1 },
							direction: RailDirection.Horizontal
						};
					default:
						return {
							cart: null,
							direction: RailDirection.None
						};
				}
			})
		);
	}
	return rails;
}
const railmap: Rail[][] = parseRailmap(input);

function turnRight(cart: Cart): void {
	switch (cart.direction) {
		case Direction.Up:
			cart.direction = Direction.Right;
			break;
		case Direction.Down:
			cart.direction = Direction.Left;
			break;
		case Direction.Left:
			cart.direction = Direction.Up;
			break;
		case Direction.Right:
			cart.direction = Direction.Down;
			break;
	}
}

function turnLeft(cart: Cart): void {
	switch (cart.direction) {
		case Direction.Up:
			cart.direction = Direction.Left;
			break;
		case Direction.Down:
			cart.direction = Direction.Right;
			break;
		case Direction.Left:
			cart.direction = Direction.Down;
			break;
		case Direction.Right:
			cart.direction = Direction.Up;
			break;
	}
}

function findFirstCrash(rails: Rail[][]): number[] {
	for (let i: number = 0; ; i++) {
		for (let y: number = 0; y < rails.length; y++) {
			for (let x: number = 0; x < rails[y].length; x++) {
				if (rails[y][x].cart && rails[y][x].cart!.lastMove !== i) {
					const cart: Cart = rails[y][x].cart!;
					let newX: number = x;
					let newY: number = y;
					switch (cart.direction) {
						case Direction.Up:
							newY -= 1;
							break;
						case Direction.Down:
							newY += 1;
							break;
						case Direction.Left:
							newX -= 1;
							break;
						case Direction.Right:
							newX += 1;
							break;
					}
					if (rails[newY][newX].cart) {
						return [newX, newY];
					} else {
						rails[newY][newX].cart = cart;
						cart.lastMove = i;
						rails[y][x].cart = null;
						switch (rails[newY][newX].direction) {
							case RailDirection.Intersection:
								switch (cart.intersections % 3) {
									case 0:
										turnLeft(cart);
										break;
									case 2:
										turnRight(cart);
										break;
								}
								cart.intersections++;
								break;
							case RailDirection.SlantedRightCorner:
								switch (cart.direction) {
									case Direction.Up:
									case Direction.Down:
										turnRight(cart);
										break;
									case Direction.Left:
									case Direction.Right:
										turnLeft(cart);
										break;
								}
								break;
							case RailDirection.SlantedLeftCorner:
								switch (cart.direction) {
									case Direction.Up:
									case Direction.Down:
										turnLeft(cart);
										break;
									case Direction.Left:
									case Direction.Right:
										turnRight(cart);
										break;
								}
								break;
						}
					}
				}
			}
		}
	}
	return [-1, -1];
}

console.log("Part 1 answer:", findFirstCrash(railmap));
