import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day3.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const part1 = async (input) => {
  const matrix = input.map((r) => r.split(""));

  const symbolPositions = [];
  matrix.forEach((r, ri) => {
    r.forEach((c, ci) => {
      if (c !== "." && isNaN(+c)) {
        symbolPositions.push([ri, ci]);
      }
    });
  });

  const numberPositions = [];
  const patt = /\^?\d+|[a-z]+/gi;
  input.forEach((r, ri) => {
    let match;
    while ((match = patt.exec(r))) {
      const adjacency = [];
      for (let ai = match.index; ai < patt.lastIndex; ai++) {
        adjacency.push([ri - 1, ai - 1], [ri - 1, ai], [ri - 1, ai + 1]);
        adjacency.push([ri, ai - 1], [ri, ai], [ri, ai + 1]);
        adjacency.push([ri + 1, ai - 1], [ri + 1, ai], [ri + 1, ai + 1]);
      }
      numberPositions.push({
        number: +match[0],
        row: ri,
        col: [match.index, patt.lastIndex - 1],
        adjacency,
        hasAdjacencySymbol: symbolPositions.some((sPos) =>
          adjacency.some((aPos) => aPos[0] === sPos[0] && aPos[1] === sPos[1])
        ),
      });
    }
  });

  return numberPositions
    .filter((n) => n.hasAdjacencySymbol)
    .map((n) => n.number)
    .reduce((a, b) => a + b, 0);
};

const part2 = async (input) => {
  const matrix = input.map((r) => r.split(""));

  const symbolPositions = [];
  matrix.forEach((r, ri) => {
    r.forEach((c, ci) => {
      if (c === "*") {
        symbolPositions.push({ pos: [ri, ci], numbers: [] });
      }
    });
  });

  const patt = /\^?\d+|[a-z]+/gi;
  input.forEach((r, ri) => {
    let match;
    while ((match = patt.exec(r))) {
      const adjacency = [];
      for (let ai = match.index; ai < patt.lastIndex; ai++) {
        adjacency.push(
          [ri - 1, ai - 1],
          [ri - 1, ai],
          [ri - 1, ai + 1],
          [ri, ai - 1],
          [ri, ai],
          [ri, ai + 1],
          [ri + 1, ai - 1],
          [ri + 1, ai],
          [ri + 1, ai + 1]
        );
      }
      symbolPositions.forEach(({ pos: sPos }, si) => {
        if (
          adjacency.some((aPos) => aPos[0] === sPos[0] && aPos[1] === sPos[1])
        ) {
          symbolPositions[si].numbers.push(+match[0]);
        }
      });
    }
  });
  return symbolPositions
    .filter((s) => s.numbers.length === 2)
    .map((s) => s.numbers[0] * s.numbers[1])
    .reduce((a, b) => a + b, 0);
};

describe("Day 3", () => {
  const testInput = [
    "467..114..",
    "...*......",
    "..35..633.",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598..",
  ];

  describe.skip("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 140);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 4361);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 533775);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 467835);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 78236071);
    });
  });
});
