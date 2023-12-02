def parseRange(r):
    # range is a pair of integers separated by a dash
    pair = r.split('-')
    start = int(pair[0])
    end = int(pair[1])
    return start, end

def main():
    with open('input.txt', 'r') as f:
        input = f.read()
    # pairs contains two ranges given as x-y, where x and y are integers, separated by a comma
    pairs = input.split('\n')

    part1 = 0
    part2 = 0
    validPairs = 0

    for pair in pairs:
        if len(pair) == 0:
            continue
        validPairs += 1

        elfs = pair.split(',')
        start, end = parseRange(elfs[0])
        start2, end2 = parseRange(elfs[1])
        if (start2 >= start and end2 <= end) or (start >= start2 and end <= end2):
            part1 += 1
        elif start2 > end or end2 < start:
            part2 += 1

    part2 = validPairs - part2

    print(part1)
    print(part2)

if __name__ == "__main__":
    main()
