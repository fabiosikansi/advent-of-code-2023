import { readFile, writeFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day10.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const populateDistance = (map, [x, y], distance) => {
  try {
    if (x < 0 || y < 0) {
      return map;
    }
    if (x >= map.length || y > map[0].length) {
      return map;
    }
    if (typeof map[x][y] === "number") {
      return map;
    }
    if (map[x][y] === ".") {
      return map;
    }
    map[x][y] = distance;
  } catch {}
  return map;
};

const findPossibleNeighbours = (map, [x, y]) => {
  try {
    const neighbors = [];
    if (map[x][y] === "S") {
      if (["-", "7", "F"].includes(map[x][y - 1])) {
        neighbors.push([x, y - 1]);
      }
      if (["-", "J", "7"].includes(map[x][y + 1])) {
        neighbors.push([x, y + 1]);
      }
      if (["|", "F", "7"].includes(map[x - 1][y])) {
        neighbors.push([x - 1, y]);
      }
      if (["|", "J", "L"].includes(map[x + 1][y])) {
        neighbors.push([x + 1, y]);
      }
    }
    if (map[x][y] === "-") {
      neighbors.push([x, y - 1], [x, y + 1]);
    }
    if (map[x][y] === "|") {
      neighbors.push([x - 1, y], [x + 1, y]);
    }
    if (map[x][y] === "L") {
      neighbors.push([x - 1, y], [x, y + 1]);
    }
    if (map[x][y] === "J") {
      neighbors.push([x - 1, y], [x, y - 1]);
    }
    if (map[x][y] === "7") {
      neighbors.push([x, y - 1], [x + 1, y]);
    }
    if (map[x][y] === "F") {
      neighbors.push([x, y + 1], [x + 1, y]);
    }
    return neighbors.filter(([px, py]) => {
      try {
        return typeof map[px][py] === "string" && map[px][py] !== ".";
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
};

const findDistance = (map, start) => {
  let q = [{ point: start, distance: 0 }];
  let curDistance = 0;
  while (q.length > 0) {
    const { point, distance } = q.shift();

    const possN = findPossibleNeighbours(map, point);
    map = populateDistance(map, point, distance);
    curDistance = map[point[0]][point[1]];
    q = q.concat(
      possN.map((p) => ({
        point: p,
        distance: curDistance + 1,
      }))
    );
  }
  return curDistance;
};

const findStart = (map) => {
  let [x, y] = [0, 0];
  map.forEach((r, ri) =>
    r.forEach((c, ci) => {
      if (c === "S") {
        x = ri;
        y = ci;
      }
    })
  );
  return [x, y];
};

const part1 = async (input) => {
  const map = input.map((l) => l.split(""));
  const start = findStart(map);

  return findDistance(map, start);
};

const fillMap = (map, [lenX, lenY], [x, y]) => {
  if (x < 0 || y < 0 || x >= lenX || y >= lenY) {
    return;
  }
  if (map[x][y] === "X" || map[x][y] === "0") {
    return;
  }
  map[x][y] = "0";
  fillMap(map, [lenX, lenY], [x - 1, y]);
  fillMap(map, [lenX, lenY], [x + 1, y]);
  fillMap(map, [lenX, lenY], [x, y - 1]);
  fillMap(map, [lenX, lenY], [x, y + 1]);
};

const part2 = (input) => {
  const originalMap = input.map((l) => l.split(""));
  const map = input.map((l) => l.split(""));
  const start = findStart(map);
  findDistance(map, start);

  const alternateMap = map.map((l) =>
    l.map((n) => (typeof n === "number" ? "X" : "I"))
  );
  // console.log(alternateMap.map((l) => l.join("")));
  alternateMap.forEach((row, i) => {
    fillMap(
      alternateMap,
      [alternateMap.length, alternateMap[0].length],
      [i, 0]
    );
    fillMap(
      alternateMap,
      [alternateMap.length, alternateMap[0].length],
      [i, alternateMap[0].length - 1]
    );
    fillMap(
      alternateMap,
      [alternateMap.length, alternateMap[0].length],
      [alternateMap[0].length - 1, 0]
    );
    fillMap(
      alternateMap,
      [alternateMap.length, alternateMap[0].length],
      [alternateMap[0].length - 1, alternateMap[0].length - 1]
    );
  });
  // console.log(alternateMap.map((l) => l.join("")));

  writeFile(
    "./day10.output",
    alternateMap
      .map((row, i) =>
        row.map((c, j) => (c === "X" ? originalMap[i][j] : c)).join("")
      )
      .join("\n")
  );

  let tiles = alternateMap
    .map((l) => l.filter((c) => c !== "0" && c !== "X").length)
    .reduce((a, b) => a + b, 0);

  return tiles;
};

describe("Day 10", () => {
  describe.skip("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 140);
    });

    test("testInput provides correct answer", async () => {
      const testInput = [".....", ".S-7.", ".|.|.", ".L-J.", "....."];
      assert.strictEqual(await part1(testInput), 4);
    });

    test("testInput2 provides correct answer", async () => {
      const testInput = ["..F7.", ".FJ|.", "SJ.L7", "|F--J", "LJ..."];
      assert.strictEqual(await part1(testInput), 8);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 6968);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      const testInput = [
        "...........",
        ".S-------7.",
        ".|F-----7|.",
        ".||.....||.",
        ".||.....||.",
        ".|L-7.F-J|.",
        ".|..|.|..|.",
        ".L--J.L--J.",
        "...........",
      ];
      assert.strictEqual(part2(testInput), 4);
    });

    test("2", () => {
      const testInput = [
        "....................",
        "FF7FSF7F7F7F7F7F---7",
        "L|LJ||||||||||||F--J",
        "FL-7LJLJ||||||LJL-77",
        "F--JF--7||LJLJ7F7FJ-",
        "L---JF-JLJ.||-FJLJJ7",
        "|F|F-JF---7F7-L7L|7|",
        "|FFJF7L7F-JF7|JL---7",
        "7-L-JL7||F7|L7F-7F7|",
        "L.L7LFJ|||||FJL7||LJ",
        "L7JLJL-JLJLJL--JLJ.L",
      ];
      assert.strictEqual(part2(testInput), 10);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 53);
    });
  });
});
