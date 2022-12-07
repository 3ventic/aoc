import * as inputs from "./input";

type F = {
	folder: Folder;
	name: string;
	size: number;
};

type Folder = {
	parent?: Folder;
	name: string;
	path: string;
	files: F[];
	folders: Folder[];
	size: number;
};

function parseInput(input: string): [Folder, Map<string, Folder>] {
	const lines = input.split("\n");
	const root: Folder = {
		name: "",
		path: "/",
		files: [],
		folders: [],
		size: -1,
	};

	const folders = new Map<string, Folder>();
	let currentPath = root.path;
	folders.set(currentPath, root);

	for (const line of lines) {
		const words = line.split(" ");
		switch (words[0]) {
			case "$":
				{
					const [_, command, path] = words;
					if (command === "cd") {
						if (path === "/") {
							currentPath = "/";
							break;
						}
						const prevPath = currentPath;
						currentPath =
							path === ".."
								? currentPath.split("/").slice(0, -1).join("/")
								: `${currentPath}/${path}`;
						if (!folders.has(currentPath)) {
							const folder: Folder = {
								name: path,
								path: currentPath,
								files: [],
								parent: folders.get(prevPath),
								folders: [],
								size: -1,
							};
							folders.set(currentPath, folder);
							folders.get(prevPath)!.folders.push(folder);
						}
					}
				}
				break;
			case "dir":
				break;
			default:
				{
					const [size, name] = words;
					const folder = folders.get(currentPath)!;
					folder.files.push({
						folder,
						name,
						size: parseInt(size),
					});
				}
				break;
		}
	}

	return [root, folders];
}

function calculateSize(folder: Folder): number {
	if (folder.size !== -1) {
		return folder.size;
	}
	let size = 0;
	for (const file of folder.files) {
		size += file.size;
	}
	for (const subfolder of folder.folders) {
		size += calculateSize(subfolder);
	}
	folder.size = size;
	return size;
}

function findSum(folders: Map<string, Folder>, sizeLimit: number): number {
	let sum = 0;
	for (const folder of folders.values()) {
		if (folder.size <= sizeLimit) {
			sum += folder.size;
		}
	}
	return sum;
}

function findSmallestAbove(
	folders: Map<string, Folder>,
	sizeLimit: number
): number {
	let smallest = Infinity;
	for (const folder of folders.values()) {
		if (folder.size > sizeLimit && folder.size < smallest) {
			smallest = folder.size;
		}
	}
	return smallest;
}

const [rootFolder, folders] = parseInput(inputs.input);
calculateSize(rootFolder);

const fileSystemSize = 70000000;
const requiredSize = 30000000;

console.log("Part 1", findSum(folders, 100000));
console.log(
	"Part 2",
	findSmallestAbove(folders, rootFolder.size - fileSystemSize + requiredSize)
);
