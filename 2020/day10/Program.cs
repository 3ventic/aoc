using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;

var inputs = (IEnumerable<int>)Input.Value.Split(new string[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries).Select(s => int.Parse(s)).OrderBy(n => n);
var chargers = inputs.Prepend(0).Append(inputs.Last() + 3).ToArray();

var star1 = chargers.Aggregate((0, 0, 0), (total, n) =>
{
    switch (n - total.Item3)
    {
        case 1: total.Item1++; break;
        case 3: total.Item2++; break;
    }
    total.Item3 = n;
    return total;
});

/**
    star2 explanation:
    list of inputs only contains steps of 1 or 3 from one number to the next,
    so group together sequences where each difference is 1 (split the chargers when there's a step of 3)
    these groups can be processed individually since other groups do not affect the number of individual ways there are
    to navigate through the current group.
 */
var star2 = GroupLengths(chargers).Select(WaysThroughGroup).Aggregate((double)1, (total, n) => total * n);

System.Console.WriteLine($"Star 1: {star1.Item1 * star1.Item2}");
System.Console.WriteLine($"Star 2: {star2}");

IEnumerable<double> GroupLengths(int[] chargers)
{
    for (int i = 0; i < chargers.Length - 1; i++)
    {
        if (chargers[i + 1] - chargers[i] != 1) continue;

        var start = i;
        while (chargers[i + 1] - chargers[i] == 1)
        {
            i++;
        }
        yield return (double)(i - start);
    }
}

double WaysThroughGroup(double n)
{
    n -= 1;
    double half = n / 2;
    return n * half + half + 1;
}

// Hack to have the input at the bottom of the file
static class Input
{
    public static string Value = @"118
14
98
154
71
127
38
50
36
132
66
121
65
26
119
46
2
140
95
133
15
40
32
137
45
155
156
97
145
44
153
96
104
58
149
75
72
57
76
56
143
11
138
37
9
82
62
17
88
33
5
10
134
114
23
111
81
21
103
126
18
8
43
108
120
16
146
110
144
124
67
79
59
89
87
131
80
139
31
115
107
53
68
130
101
22
125
83
92
30
39
102
47
109
152
1
29
86";
}
