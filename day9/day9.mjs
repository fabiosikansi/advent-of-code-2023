import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day9.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const getDiffArray = (values) => {
  return values.slice(1).map((v, i) => v - values[i]);
};

const linePrediction = (lineValues, startOrEnd = "start") => {
  const result = [lineValues];
  while (result[result.length - 1].some((v) => v !== 0)) {
    result.push(getDiffArray(result[result.length - 1]));
  }
  const lastRow = result.length - 1;
  result[lastRow].push(0);
  for (let i = lastRow - 1; i >= 0; i--) {
    if (startOrEnd === "start") {
      result[i].unshift(result[i][0] - result[i + 1][0]);
    } else {
      result[i].push(
        result[i + 1][result[i + 1].length - 1] +
          result[i][result[i].length - 1]
      );
    }
  }
  return startOrEnd === "start" ? result[0].shift() : result[0].pop();
};

const part1 = async (input) => {
  return input
    .map((l) => l.split(" ").map((n) => +n))
    .map((l) => linePrediction(l, "end"))
    .reduce((a, b) => a + b, 0);
};

const part2 = async (input) => {
  return input
    .map((l) => l.split(" ").map((n) => +n))
    .map((l) => linePrediction(l, "start"))
    .reduce((a, b) => a + b, 0);
};

describe("Day 9", () => {
  const testInput = ["0 3 6 9 12 15", "1 3 6 10 15 21", "10 13 16 21 30 45"];

  test("get diff array returns list of difference between each value and its predecessor", () => {
    assert.deepEqual(getDiffArray([0, 3, 6, 9, 12, 15]), [3, 3, 3, 3, 3]);
    assert.deepEqual(getDiffArray([1, 3, 6, 10, 15, 21]), [2, 3, 4, 5, 6]);
  });
  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 200);
    });

    test("predict next line value", () => {
      assert.strictEqual(linePrediction([0, 3, 6, 9, 12, 15], "end"), 18);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 114);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 1702218515);
    });
  });

  describe("Part 2", () => {
    test("predict previous line value", () => {
      assert.deepEqual(linePrediction([10, 13, 16, 21, 30, 45], "start"), 5);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 2);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 925);
    });
  });
});
