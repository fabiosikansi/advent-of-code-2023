import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./dayX.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const part1 = async (input) => {
  return 0;
};

const part2 = async (input) => {
  return 0;
};

describe("Day X", () => {
  const testInput = [];
  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 100);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 0);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 0);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 0);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 0);
    });
  });
});
