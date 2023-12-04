import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const game = (input, target) => {
  const [gameId, gameString] = input.split(": ");
  let isPossible = true;

  const rounds = gameString.split("; ");
  for (const r of rounds) {
    const rInput = r.split(", ");
    for (const t of rInput) {
      const [num, colour] = t.split(" ");
      if (+num > target[colour]) {
        isPossible = false;
      }
    }
  }

  return { gameId: +gameId.replace("Game ", ""), gameString, isPossible };
};

const gameMinimum = (input) => {
  const min = { red: 0, blue: 0, green: 0 };
  const [gameId, gameString] = input.split(": ");
  const rounds = gameString.split("; ");
  for (const r of rounds) {
    const rInput = r.split(", ");
    for (const t of rInput) {
      const [num, colour] = t.split(" ");
      if (+num > min[colour]) {
        min[colour] = num;
      }
    }
  }
  return {
    gameId: +gameId.replace("Game ", ""),
    gameString,
    minimumPower: min.red * min.blue * min.green,
  };
};

const part1 = async (input, target) => {
  const result = input
    .map((g) => game(g, target))
    .filter((g) => g.isPossible)
    .map((g) => g.gameId)
    .reduce((a, b) => a + b, 0);
  return result;
};

const part2 = async (input) => {
  const result = input
    .map((g) => gameMinimum(g))
    .map((g) => g.minimumPower)
    .reduce((a, b) => a + b, 0);
  return result;
};

describe("Day 2", () => {
  const testInput = [
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
  ];
  describe("Part 1", () => {
    const target = { red: 12, green: 13, blue: 14 };

    test("read input file", async () => {
      const content = await readFileContents("./day2.input");
      assert.strictEqual(content.length, 100);
    });

    test("1st test game matches expected output", () => {
      const result = game(testInput[0], target);
      assert.strictEqual(result.gameId, 1);
      assert.strictEqual(result.isPossible, true);
    });

    test("3rd test game matches expected output", () => {
      const result = game(testInput[2], target);
      assert.strictEqual(result.gameId, 3);
      assert.strictEqual(result.isPossible, false);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput, target), 8);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents("./day2.input");
      assert.strictEqual(await part1(content, target), 2006);
    });
  });

  describe("Part 2", () => {
    test("1st test game matches expected output", () => {
      const result = gameMinimum(testInput[0]);
      assert.strictEqual(result.gameId, 1);
      assert.strictEqual(result.minimumPower, 48);
    });

    test("3rd test game matches expected output", () => {
      const result = gameMinimum(testInput[2]);
      assert.strictEqual(result.gameId, 3);
      assert.strictEqual(result.minimumPower, 1560);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 2286);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents("./day2.input");
      assert.strictEqual(await part2(content), 84911);
    });
  });
});
