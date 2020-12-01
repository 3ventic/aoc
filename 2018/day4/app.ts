import input from "./input";

const sorted = input.sort();
let asleep: Map<string, Map<number, number>> = new Map();

let currentGuard = "";
let fellAsleep = -1;
for (const line of sorted) {
    const parts = line.split('] ');
    const minute = parseInt(parts[0].split(' ')[1].split(':')[1]);
    const action = parts[1];
    switch (action[0]) {
        case 'f':
            fellAsleep = minute;
            break;
        case 'w':
            for (let i = fellAsleep; i < minute; i++) {
                if (!asleep.has(currentGuard)) {
                    asleep.set(currentGuard, new Map());
                }
                asleep.get(currentGuard).set(i, (asleep.get(currentGuard).get(i) || 0) + 1);
            }
            break;
        case 'G':
            const guard = action.split(' ')[1];
            currentGuard = guard;
            break;
        default:
            console.error("Unknown case");
            break;
    }
}

interface SleepyTime {
    minute: number;
    times: number;
}

interface Guard {
    id: string;
    minutes: number;
    asleep: SleepyTime;
}

let mostAsleep: Guard = {
    id: "",
    minutes: 0,
    asleep: {
        minute: -1,
        times: 0
    }
}
let mostPredictablyAsleep: Guard = {
    id: "",
    minutes: 0,
    asleep: {
        minute: -1,
        times: 0
    }
}
for (const [id, sleepTimes] of asleep) {
    let minutes = 0;
    let sleepy: SleepyTime = {
        minute: -1,
        times: 0
    }
    for (const [m, v] of sleepTimes) {
        minutes += v;
        if (v > sleepy.times) {
            sleepy = {
                minute: m,
                times: v
            }
        }
    }
    if (minutes > mostAsleep.minutes) {
        mostAsleep = {
            id: id,
            minutes: minutes,
            asleep: sleepy
        }
    }
    if (sleepy.times > mostPredictablyAsleep.asleep.times) {
        mostPredictablyAsleep = {
            id: id,
            minutes: minutes,
            asleep: sleepy
        }
    }
}

console.log("SLEEPS MOST", mostAsleep);
console.log("PREDICTABLE", mostPredictablyAsleep);

const answer = (guard: Guard) => parseInt(guard.id.substring(1)) * guard.asleep.minute;

console.log("Part 1 answer:", answer(mostAsleep));
console.log("Part 2 answer:", answer(mostPredictablyAsleep));