// delimited - https://stackoverflow.com/a/37580979
export function permute<T>(permutation: T[]): T[][] {
	var length = permutation.length,
		result = [permutation.slice()],
		c = new Array(length).fill(0),
		i = 1,
		k,
		p

	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i]
			p = permutation[i]
			permutation[i] = permutation[k]
			permutation[k] = p
			++c[i]
			i = 1
			result.push(permutation.slice())
		} else {
			c[i] = 0
			++i
		}
	}
	return result
}
