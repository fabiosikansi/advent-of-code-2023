import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day4.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const parseCardInput = (cardInput) => {
  const [name, values] = cardInput.split(": ");
  const [winningNumbers, cardNumbers] = values.split(" | ").map((l) =>
    l
      .trim()
      .split(/\s+/)
      .map((v) => +v)
  );
  return { name, winningNumbers, cardNumbers };
};

const checkCardResult = (cardInput) => {
  const { name, winningNumbers, cardNumbers } = parseCardInput(cardInput);
  const winningCount = cardNumbers.filter((c) =>
    winningNumbers.some((n) => n === c)
  ).length;
  const result = winningCount > 0 ? Math.pow(2, winningCount - 1) : 0;
  return { name, winningNumbers, cardNumbers, winningCount, result, copies: 0 };
};

const part1 = async (input) => {
  return input
    .map((r) => checkCardResult(r))
    .map((r) => r.result)
    .reduce((a, b) => a + b, 0);
};

const part2 = async (input) => {
  const cardsResult = input.map((r) => checkCardResult(r));
  for (let [cardIndex, card] of cardsResult.entries()) {
    cardsResult[cardIndex].copies++;
    for (let c = cardIndex + 1; c <= cardIndex + card.winningCount; c++) {
      cardsResult[c].copies =
        cardsResult[c].copies + cardsResult[cardIndex].copies;
    }
  }

  return cardsResult.map((c) => c.copies).reduce((a, b) => a + b, 0);
};

describe("Day 4", () => {
  const testInput = [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
  ];
  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 214);
    });

    test("check card result returns expected value", async () => {
      assert.strictEqual(
        checkCardResult("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53")
          .result,
        8
      );
      assert.strictEqual(
        checkCardResult("Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1")
          .result,
        2
      );
      assert.strictEqual(
        checkCardResult("Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36")
          .result,
        0
      );
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part1(testInput), 13);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part1(content), 23750);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await part2(testInput), 30);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await part2(content), 13261850);
    });
  });
});
