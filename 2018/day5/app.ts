import input from "./input";

const isUpper = (char: string) => /^[A-Z]$/.test(char);

const react = (arr: Array<string>, remove?: string): Array<string> => {
    let copy = arr.slice();
    for (let i = 0; i < copy.length - 1; i++) {
        if (copy[i].toLowerCase() === remove) {
            copy.splice(i, 1);
            i -= (i == 0 ? 0 : 1);
        }
        let current = isUpper(copy[i]) ? copy[i].toLowerCase() : copy[i].toUpperCase();
        if (current === copy[i + 1]) {
            copy.splice(i, 2);
            i -= (i == 0 ? 1 : 2);
        }
    }
    return copy
}

const reacted = react(input);

// Quick and dirty part 2
interface ReactBlocker {
    char: string;
    length: number;
}
let shortest: ReactBlocker = {
    char: '',
    length: Number.MAX_SAFE_INTEGER,
};
for (let i = 0x61; i <= 0x7A; i++) {
    const c = String.fromCodePoint(i);
    const length = react(input, c).length;
    if (length < shortest.length) {
        shortest = {
            char: c,
            length: length,
        }
    }
}

console.log("Part 1 answer:", reacted.length);
console.log("Part 2 answer:", shortest.length, `(${shortest.char})`);