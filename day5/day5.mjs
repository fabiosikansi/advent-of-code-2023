import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day5.input";

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`.split(`\n`);

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const parseInput = (lines) => {
  const seeds = lines[0]
    .split(": ")
    .pop()
    .split(" ")
    .map((n) => +n);

  let currentMap = "";
  const maps = {};
  lines.slice(2).forEach((l) => {
    if (l.endsWith(" map:")) {
      currentMap = l.split(" ")[0];
      maps[currentMap] = [];
    } else if (l.split(" ").length === 3) {
      const [destinationStart, sourceStart, rangeLength] = l
        .split(" ")
        .map((n) => +n);
      maps[currentMap].push({ destinationStart, sourceStart, rangeLength });
    }
  });
  return { seeds, maps };
};

const getCorrespondentPosition = (pos, mapping) => {
  for (const { destinationStart, sourceStart, rangeLength } of mapping) {
    if (pos >= sourceStart && pos < sourceStart + rangeLength) {
      return destinationStart + (pos - sourceStart);
    }
  }
  return pos;
};

const getSeedLocation = (seed, maps) => {
  const soil = getCorrespondentPosition(seed, maps["seed-to-soil"]);
  const fertilizer = getCorrespondentPosition(soil, maps["soil-to-fertilizer"]);
  const water = getCorrespondentPosition(
    fertilizer,
    maps["fertilizer-to-water"]
  );
  const light = getCorrespondentPosition(water, maps["water-to-light"]);
  const temperature = getCorrespondentPosition(
    light,
    maps["light-to-temperature"]
  );
  const humidity = getCorrespondentPosition(
    temperature,
    maps["temperature-to-humidity"]
  );
  const location = getCorrespondentPosition(
    humidity,
    maps["humidity-to-location"]
  );
  return location;
};

const part1 = async (input) => {
  const { seeds, maps } = parseInput(input);
  return Math.min(...seeds.map((s) => getSeedLocation(s, maps)));
};

const part2 = async (input) => {
  const { seeds, maps } = parseInput(input);
  const pairs = Array.from({ length: seeds.length / 2 }, (_, i) =>
    seeds.slice(i * 2, i * 2 + 2)
  );
  let min = 909796150;
  pairs.forEach(([start, len]) => {
    for (let i = start; i < start + len; i++) {
      const loc = getSeedLocation(i, maps);
      if (loc < min) min = loc;
    }
  });
  return min;
};

describe("Day 5", () => {
  describe.skip("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 190);
    });

    test("get correspondent position returns correct answer", () => {
      assert.strictEqual(
        getCorrespondentPosition(79, [
          { destinationStart: 50, sourceStart: 98, rangeLength: 2 },
          { destinationStart: 52, sourceStart: 50, rangeLength: 48 },
        ]),
        81
      );
      assert.strictEqual(
        getCorrespondentPosition(20, [
          { destinationStart: 50, sourceStart: 98, rangeLength: 2 },
          { destinationStart: 52, sourceStart: 50, rangeLength: 48 },
        ]),
        20
      );
      assert.strictEqual(
        getCorrespondentPosition(98, [
          { destinationStart: 50, sourceStart: 98, rangeLength: 2 },
          { destinationStart: 52, sourceStart: 50, rangeLength: 48 },
        ]),
        50
      );
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 35);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 309796150);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 46);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 50716416);
    });
  });
});
