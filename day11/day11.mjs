import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day11.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const solve = async (input, gap = 2) => {
  const map = input.map((r) => r.split(""));
  const extendedMapRows = map.reduce(
    (matrix, line) =>
      matrix.concat(
        line.every((c) => c === ".") ? [Array(line.length).fill("*")] : [line]
      ),
    []
  );
  const extendedMapTransposed = extendedMapRows[0]
    .map((_, colIndex) => extendedMapRows.map((row) => row[colIndex]))
    .reduce(
      (matrix, line) =>
        matrix.concat(
          line.every((c) => c === "." || c === "*")
            ? [Array(line.length).fill("*")]
            : [line]
        ),
      []
    );

  const extendedMap = extendedMapTransposed[0].map((_, colIndex) =>
    extendedMapTransposed.map((row) => row[colIndex])
  );

  // console.log(extendedMap.map((r) => r.join("")));

  let c = 1;
  const galaxies = [];
  for (const [i, row] of extendedMap.entries()) {
    for (const [j, v] of row.entries()) {
      if (v === "#") {
        galaxies.push({ i, j, c });
        extendedMap[i][j] = c;
        c++;
      }
    }
  }

  const distances = [];
  for (const [i, g] of galaxies.entries()) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const [iStart, iEnd] =
        g.i < galaxies[j].i ? [g.i, galaxies[j].i] : [galaxies[j].i, g.i];
      const [jStart, jEnd] =
        g.j < galaxies[j].j ? [g.j, galaxies[j].j] : [galaxies[j].j, g.j];

      const horDistance = extendedMap[iStart]
        .slice(jStart, jEnd)
        .reduce((a, b) => a + (b === "*" ? gap : 1), 0);

      const vertDistance = extendedMapTransposed[jStart]
        .slice(iStart, iEnd)
        .reduce((a, b) => a + (b === "*" ? gap : 1), 0);
      distances.push(horDistance + vertDistance);
    }
  }

  return distances.reduce((a, b) => a + b, 0);
};

describe("Day 11", () => {
  const testInput = [
    "...#......",
    ".......#..",
    "#.........",
    "..........",
    "......#...",
    ".#........",
    ".........#",
    "..........",
    ".......#..",
    "#...#.....",
  ];
  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 140);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await solve(testInput), 374);
    });

    test.skip("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await solve(content), 9605127);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await solve(testInput, 10), 1030);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await solve(content, 1000000), 458191688761);
    });
  });
});
