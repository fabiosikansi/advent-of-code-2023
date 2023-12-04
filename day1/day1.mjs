import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day1.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const numberWords = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const getStart = (w, considerWords = false) => {
  for (let i = 0; i < w.length; i++) {
    const partial = w.substring(i);
    if (!isNaN(partial[0])) {
      return +partial[0];
    }
    if (considerWords) {
      for (const [ni, n] of numberWords.entries()) {
        if (partial.startsWith(n)) {
          return ni + 1;
        }
      }
    }
  }
};

const getEnd = (w, considerWords = false) => {
  for (let i = w.length - 1; i >= 0; i--) {
    const partial = w.substring(0, i + 1);
    if (!isNaN(partial[i])) {
      return +partial[i];
    }
    if (considerWords) {
      for (const [ni, n] of numberWords.entries()) {
        if (partial.endsWith(n)) {
          return ni + 1;
        }
      }
    }
  }
};

const getNumber = (originalWord, considerWords = false) => {
  let s, e;
  s = getStart(originalWord, considerWords);
  e = getEnd(originalWord, considerWords);
  return s * 10 + e;
};

const part1 = async (input) => {
  return input.map((w) => getNumber(w)).reduce((a, b) => a + b, 0);
};

const part2 = async (input) => {
  return input.map((w) => getNumber(w, true)).reduce((a, b) => a + b, 0);
};

describe("Day 1", () => {
  const testInput = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];
  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 1000);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 142);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 54940);
    });
  });

  describe("Part 2", () => {
    const testInput = [
      "two1nine",
      "eightwothree",
      "abcone2threexyz",
      "xtwone3four",
      "4nineeightseven2",
      "zoneight234",
      "7pqrstsixteen",
    ];
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 281);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 54208);
    });
  });
});
