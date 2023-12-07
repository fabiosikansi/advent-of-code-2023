import { readFile } from "fs/promises";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const INPUT_FILE = "./day7.input";

async function readFileContents(filename) {
  const content = await readFile(filename, "utf8");
  return content.split("\n");
}

const CARDS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
].reverse();

const cardsStrength = (cardsCountList) => {
  if (cardsCountList.length === 5) {
    return 1; // high card
  }
  if (cardsCountList.length === 4) {
    return 2; // pair
  }
  if (cardsCountList.length === 3) {
    if (cardsCountList.reduce((a, b) => a * b, 1) === 3) {
      return 6; // three of a kind
    }
    return 4; // two pairs
  }
  if (cardsCountList.length === 2) {
    if (cardsCountList.reduce((a, b) => a * b, 1) === 4) {
      return 9; //four of a kind
    }
    return 8; //full house
  }
  if (cardsCountList.length === 1) {
    return 10; // five of a kind
  }
};

const handStrength = (hand, withJoker = false) => {
  const handCards = hand.split("");
  const cardsCount = handCards.reduce(
    (acc, c) => ({ ...acc, [c]: acc?.[c] > 0 ? acc?.[c] + 1 : 1 }),
    { J: 0 }
  );
  const countJoker = withJoker ? cardsCount["J"] : 0;
  if (withJoker || cardsCount["J"] === 0) {
    delete cardsCount["J"];
  }
  const cardsCountList = Object.values(cardsCount).sort((a, b) => b - a);
  cardsCountList[0] += countJoker;
  return cardsStrength(cardsCountList);
};

const parseHands = (input, withJoker = false) => {
  return input.map((l) => {
    const [hand, bid] = l.split(" ");

    return {
      bid: +bid,
      hand,
      handStrength: handStrength(hand, withJoker),
    };
  });
};

const solve = async (input, withJoker = false) => {
  const cardsValues = CARDS.filter((c) => !withJoker || c !== "J");
  const hands = parseHands(input, withJoker).sort((handA, handB) => {
    if (handA.handStrength !== handB.handStrength) {
      return handA.handStrength - handB.handStrength;
    } else {
      for (const [i, card] of handA.hand.split("").entries()) {
        if (card !== handB.hand[i]) {
          return cardsValues.indexOf(card) - cardsValues.indexOf(handB.hand[i]);
        }
      }
      return 1;
    }
  });
  return hands.map((h, i) => (i + 1) * h.bid).reduce((a, b) => a + b, 0);
};

describe("Day 7", () => {
  const testInput = [
    "32T3K 765",
    "T55J5 684",
    "KK677 28",
    "KTJJT 220",
    "QQQJA 483",
  ];

  describe("Part 1", () => {
    test("read input file", async () => {
      const input = await readFileContents(INPUT_FILE);
      assert.strictEqual(input.length, 1000);
    });

    test("hand strength returns expected value", () => {
      assert.strictEqual(handStrength("32T3K"), 2);
      assert.strictEqual(handStrength("KK677"), 4);
      assert.strictEqual(handStrength("QQQJA"), 6);
      assert.strictEqual(handStrength("444AA"), 8);
      assert.strictEqual(handStrength("4444A"), 9);
      assert.strictEqual(handStrength("44444"), 10);
    });

    test("testInput provides correct answer", async () => {
      assert.strictEqual(await solve(testInput), 6440);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await solve(content), 247823654);
    });
  });

  describe("Part 2", () => {
    test("testInput provides correct answer", async () => {
      assert.strictEqual(await solve(testInput, true), 5905);
    });

    test("input provides correct answer", async () => {
      const content = await readFileContents(INPUT_FILE);
      assert.strictEqual(await solve(content, true), 245461700);
    });
  });
});
