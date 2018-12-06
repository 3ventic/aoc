import * as spawn from "cross-spawn";
import { ChildProcess } from "child_process";

const arg: string = "./app.ts";
const tsnode: ChildProcess = spawn("ts-node", [arg], { cwd: process.argv[2], shell: true });

process.stdin.pipe(tsnode.stdin);
tsnode.stdout.pipe(process.stdout);
tsnode.stderr.pipe(process.stderr);

tsnode.on("error", e => console.error(e));

tsnode.on("close", (c: number) => process.exit(c));
