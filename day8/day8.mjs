import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day8.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const parseMap = (input) => {
  const directions = input[0].split("");
  const map = input.slice(2).reduce((acc, line) => {
    const [point, coordinates] = line.split(" = ");
    const coordinates2 = coordinates
      .replace("(", "")
      .replace(")", "")
      .split(", ");
    return {
      ...acc,
      [point]: { l: coordinates2[0], r: coordinates2[1] },
    };
  }, {});
  return { directions, map };
};

const part1 = async (input) => {
  const { directions, map } = parseMap(input);
  return stepsFromStart("AAA", directions, map);
};

const stepsFromStart = (start, directions, map, allEndingWithZ = false) => {
  let steps = 0;
  let pos = start;

  while (true) {
    for (const d of directions) {
      steps++;
      pos = d === "R" ? map[pos].r : map[pos].l;
      if (allEndingWithZ ? pos.endsWith("Z") : pos === "ZZZ") {
        return steps;
      }
    }
  }
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const lcm = (list) => {
  let ans = list[0];
  for (let i = 1; i < list.length; i++)
    ans = (list[i] * ans) / gcd(list[i], ans);
  return ans;
};

const part2 = async (input) => {
  const { directions, map } = parseMap(input);
  const start = Object.keys(map).filter((k) => k.endsWith("A"));
  const paths = start.map((s) => stepsFromStart(s, directions, map, true));
  return lcm(paths);
};

describe("Day 8", () => {
  describe("Part 1", () => {
    const testInput = [
      "RL",
      "",
      "AAA = (BBB, CCC)",
      "BBB = (DDD, EEE)",
      "CCC = (ZZZ, GGG)",
      "DDD = (DDD, DDD)",
      "EEE = (EEE, EEE)",
      "GGG = (GGG, GGG)",
      "ZZZ = (ZZZ, ZZZ)",
    ];

    const testInput2 = [
      "LLR",
      "",
      "AAA = (BBB, BBB)",
      "BBB = (AAA, ZZZ)",
      "ZZZ = (ZZZ, ZZZ)",
    ];
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 740);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 2);
      assert.strictEqual(await part1(testInput2), 6);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 13771);
    });
  });

  describe("Part 2", () => {
    const testInput = [
      "LR",
      "",
      "11A = (11B, XXX)",
      "11B = (XXX, 11Z)",
      "11Z = (11B, XXX)",
      "22A = (22B, XXX)",
      "22B = (22C, 22C)",
      "22C = (22Z, 22Z)",
      "22Z = (22B, 22B)",
      "XXX = (XXX, XXX)",
    ];

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 6);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 13129439557681);
    });
  });
});
