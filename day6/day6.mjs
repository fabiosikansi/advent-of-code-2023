import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day6.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const solveRace = ({ t, d }) => {
  let solutions = 0;
  for (let i = 0; i < t; i++) {
    const timeLeft = t - i;
    const speed = i;
    if (speed * timeLeft > d) {
      solutions++;
    }
  }
  return solutions;
};

const part1 = async (input) => {
  const [time, distance] = input.map((l) =>
    l
      .split(":")
      .pop()
      .trim()
      .split(/\s+/)
      .map((v) => +v)
  );
  const racePairs = time.map((t, i) => ({ t, d: distance[i] }));
  return racePairs.map((p) => solveRace(p)).reduce((a, b) => a * b, 1);
};

describe("Day 6", () => {
  const testInput = ["Time:      7  15   30", "Distance:  9  40  200"];

  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 2);
    });

    test("solveRace provides correct answer", async () => {
      assert.strictEqual(await solveRace({ d: 9, t: 7 }), 4);
      assert.strictEqual(await solveRace({ d: 40, t: 15 }), 8);
      assert.strictEqual(await solveRace({ d: 200, t: 30 }), 9);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 288);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 32076);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(solveRace({ d: 940200, t: 71530 }), 71503);
    });

    test("input provides correct answer", async () => {
      assert.strictEqual(
        solveRace({ d: 208158110501102, t: 44806572 }),
        34278221
      );
    });
  });
});
