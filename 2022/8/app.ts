import * as input from "./input";

type Tree = {
	height: number;
	scenicScore: number;
	seesBeyondEdge: boolean;
};

function parseInput(input: string): Tree[][] {
	const lines = input.split("\n");
	const graph: Tree[][] = [];
	for (const line of lines) {
		const row = Array.from(line).map((x) => ({
			height: parseInt(x),
			scenicScore: 0,
			seesBeyondEdge: false,
		}));
		graph.push(row);
	}
	return graph;
}

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
	for (let rowNumber = 0; rowNumber < graph.length; rowNumber++) {
		for (let colNumber = 0; colNumber < graph[rowNumber].length; colNumber++) {
			const tree = graph[rowNumber][colNumber];
			const row = graph[rowNumber];
			const col = graph.map((row) => row[colNumber]);
			let scenicScore = 1;
			scenicScore *= countVisible(tree, row.slice(colNumber + 1));
			scenicScore *= countVisible(tree, row.slice(0, colNumber).reverse());
			scenicScore *= countVisible(tree, col.slice(rowNumber + 1));
			scenicScore *= countVisible(tree, col.slice(0, rowNumber).reverse());
			tree.scenicScore = scenicScore;
			if (tree.seesBeyondEdge) {
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
const [{ scenicScore: part2 }, part1] = scenicScores(graphs);

console.log("Part 1: ", part1);
console.log("Part 2: ", part2);
