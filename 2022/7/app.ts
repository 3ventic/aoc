import * as inputs from "./input";

type F = {
	folder: Folder;
	name: string;
	size: number;
};

type Folder = {
	parent?: Folder;
	name: string;
	files: F[];
	folders: Folder[];
	size: number;
};

function parseInput(input: string): [Folder, Folder[]] {
	const lines = input.split("\n");
	const root: Folder = {
		name: "/",
		files: [],
		folders: [],
		size: 0,
	};

	const folders: Folder[] = [];
	folders.push(root);
	let currentFolder: Folder = root;

	for (const line of lines) {
		const words = line.split(" ");
		if (words[0] === "$") {
			const [, command, path] = words;
			if (command === "cd") {
				if (path === "/") {
					currentFolder = root;
					continue;
				}

				if (path === "..") {
					const parent = currentFolder.parent || root;
					parent.size += currentFolder.size;
					currentFolder = parent;
					continue;
				}

				const prevFolder = currentFolder;
				currentFolder = {
					name: path,
					files: [],
					parent: prevFolder,
					folders: [],
					size: 0,
				};
				folders.push(currentFolder);
				prevFolder.folders.push(currentFolder);
			}
		} else if (words[0] !== "dir") {
			const [size, name] = words;
			const fileSize = parseInt(size);
			currentFolder.files.push({
				folder: currentFolder,
				name,
				size: fileSize,
			});
			currentFolder.size += fileSize;
		}
	}

	while (currentFolder.parent) {
		currentFolder.parent.size += currentFolder.size;
		currentFolder = currentFolder.parent;
	}

	return [root, folders];
}

function findSum(folders: Folder[], sizeLimit: number): number {
	let sum = 0;
	for (const folder of folders) {
		if (folder.size <= sizeLimit) {
			sum += folder.size;
		}
	}
	return sum;
}

function findSmallestAbove(folders: Folder[], sizeLimit: number): number {
	let smallest = Infinity;
	for (const folder of folders) {
		if (folder.size > sizeLimit && folder.size < smallest) {
			smallest = folder.size;
		}
	}
	return smallest;
}

const [rootFolder, folders] = parseInput(inputs.input);
const fileSystemSize = 70000000;
const requiredSize = 30000000;

console.log("Part 1", findSum(folders, 100000));
console.log(
	"Part 2",
	findSmallestAbove(folders, rootFolder.size - fileSystemSize + requiredSize)
);
