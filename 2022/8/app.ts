import * as input from "./input";

type Tree = {
	height: number;
	scenicScore: number;
	seesBeyondEdge: boolean;
	counted: number;

	// old part 1
	// visibility?: number;
};

const VISIBLE_PART_1 = 0b0001;
const VISIBLE_PART_2 = 0b0010;

function parseInput(input: string): [Tree[][], Tree[][]] {
	const lines = input.split("\n");
	const graph: Tree[][] = [];
	const rotatedGraph: Tree[][] = [];
	for (const line of lines) {
		const row = Array.from(line).map((x) => ({
			height: parseInt(x),
			counted: 0,
			scenicScore: 0,
			seesBeyondEdge: false,
		}));
		graph.push(row);
		for (let i = 0; i < row.length; i++) {
			if (!rotatedGraph[i]) {
				rotatedGraph[i] = [];
			}
			rotatedGraph[i].push(row[i]);
		}
	}
	return [graph, rotatedGraph];
}

// function updateVisibility(
// 	tree: Tree,
// 	previousHeight: number,
// 	onEdge: boolean
// ): number {
// 	if (onEdge && !(tree.counted & VISIBLE_PART_1)) {
// 		tree.visibility = tree.height;
// 		tree.counted |= VISIBLE_PART_1;
// 		return 1;
// 	}
// 	let newVisibility = tree.height - previousHeight;
// 	const moreVisible =
// 		tree.visibility === undefined || newVisibility > tree.visibility;
// 	if (moreVisible) {
// 		tree.visibility = newVisibility;
// 	}
// 	if (newVisibility > 0 && !(tree.counted & VISIBLE_PART_1)) {
// 		tree.counted |= VISIBLE_PART_1;
// 		return 1;
// 	}
// 	return 0;
// }

// function visibleInLine(line: Tree[]): number {
// 	let trees = 0;
// 	let previousHighest = 0;
// 	for (let i = 0; i < line.length; i++) {
// 		let tree = line[i];
// 		trees += updateVisibility(tree, previousHighest, i === 0);
// 		if (tree.height > previousHighest) {
// 			previousHighest = tree.height;
// 		}
// 	}
// 	return trees;
// }

// function visibleTrees(graphs: [Tree[][], Tree[][]]): number {
// 	let trees = 0;
// 	for (const row of graphs[0]) {
// 		trees += visibleInLine(row);
// 		trees += visibleInLine([...row].reverse());
// 	}
// 	for (const col of graphs[1]) {
// 		trees += visibleInLine(col);
// 		trees += visibleInLine([...col].reverse());
// 	}
// 	return trees;
// }

function countVisible(tree: Tree, trees: Tree[]): number {
	let visible = 0;
	for (let i = 0; i < trees.length; i++) {
		visible++;
		const rowTree = trees[i];
		if (rowTree.height >= tree.height) {
			return visible;
		}
	}
	tree.seesBeyondEdge = true;
	return visible;
}

function scenicScores(graph: Tree[][]): [Tree, number] {
	let bestTree = graph[0][0];
	let edgeVisible = 0;
	for (let x = 0; x < graph.length; x++) {
		for (let y = 0; y < graph[x].length; y++) {
			const tree = graph[y][x];
			const row = graph[y];
			const col = graph.map((row) => row[x]);
			let scenicScore = 1;
			scenicScore *= countVisible(tree, row.slice(x + 1));
			scenicScore *= countVisible(tree, row.slice(0, x).reverse());
			scenicScore *= countVisible(tree, col.slice(y + 1));
			scenicScore *= countVisible(tree, col.slice(0, y).reverse());
			tree.scenicScore = scenicScore;
			if (tree.seesBeyondEdge && !(tree.counted & VISIBLE_PART_2)) {
				tree.counted |= VISIBLE_PART_2;
				edgeVisible++;
			}
			if (scenicScore > bestTree.scenicScore) {
				bestTree = tree;
			}
		}
	}
	return [bestTree, edgeVisible];
}

const graphs = parseInput(input.input);
const [{ scenicScore: part2 }, part1] = scenicScores(graphs[0]);

// console.log("Part 1: ", visibleTrees(graphs));
console.log("Part 1: ", part1);
console.log("Part 2: ", part2);
