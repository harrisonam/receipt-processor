import { PointCalculation } from "./receipt-point-calculation";

import { ReceiptItem } from "../../dtos/receipt-response.dto";

describe("PointCalculations", () => {
  describe("alphanumeric", () => {
    it.each([
      [13, "Hello 123 World!"],
      [0, ""],
    ])("Should accrue %i points for string %s", (expected, str) => {
      expect(PointCalculation.alphanumeric(str)).toBe(expected);
    });
  });
  describe("checkRoundedTotal", () => {
    it.each([
      [50, 100.0],
      [0, 100.1],
      [50, 0],
      [50, 1],
    ])(
      "Should accrue %i points when the total dollar amount is %f",
      (points, dollars) => {
        expect(PointCalculation.checkRoundedTotal(dollars)).toBe(points);
      }
    );
  });

  describe("multipleOf25", () => {
    it.each([
      [0, 0.3],
      [25, 0.25],
      [25, 0.5],
      [25, 0.75],
      [25, 1.0],
      [25, 1.25],
      [25, 100],
      [0, 22.2],
    ])("Should accrue %f points for %f", (points, dollars) => {
      expect(PointCalculation.multipleOf25(dollars)).toBe(points);
    });
  });

  describe("countTwoItems", () => {
    it.each([
      [0, 0],
      [0, 1],
      [5, 2],
      [5, 3],
      [10, 4],
      [10, 5],
    ])(
      "Should accrue 5 points for every two items on the receipt. [%i points, %i items]",
      (points, items) => {
        expect(PointCalculation.countTwoItems(items)).toBe(points);
      }
    );
  });

  describe("trimmedItemDescriptionMultiple", () => {
    const tests = [
      [
        {
          shortDescription: "Mountain Dew 12PK",
          price: 6.49,
        },
        0,
      ],
      [
        {
          shortDescription: "Emils Cheese Pizza",
          price: 12.25,
        },
        3,
      ],
      [
        {
          shortDescription: "Knorr Creamy Chicken",
          price: 1.26,
        },
        0,
      ],
      [
        {
          shortDescription: "Doritos Nacho Cheese",
          price: 3.35,
        },
        0,
      ],
      [
        {
          shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
          price: 12.0,
        },
        3,
      ],
      [
        {
          shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
          price: 60.0,
        },
        12,
      ],
    ] as unknown as [ReceiptItem, number][];
    it.each(tests)("ReceiptItem %s should accrue %i points", (str, points) => {
      expect(PointCalculation.trimmedItemDescriptionMultiple(str)).toBe(points);
    });
  });

  describe("oddPurchaseDate", () => {
    it.each([
      [6, "2022-01-01"],
      [6, "2022-01-13"],
      [0, "2022-01-02"],
      [0, "2023-01-04"],
    ])(
      "Should accrue 6 points if the day in the purchase date is odd. [points: %i, string: %s]",
      (points, date) => {
        expect(PointCalculation.oddPurchaseDate(date)).toBe(points);
      }
    );
    it("Should throw an error for erroneous datestrings", () => {
      expect(() => PointCalculation.oddPurchaseDate("123")).toThrowError();
    });
  });

  describe("purchaseTime", () => {
    it.each([
      [0, "12:34"],
      [0, "23:59"],
      [0, "13:59"],
      [10, "14:00"],
      [10, "14:01"],
      [10, "14:59"],
      [0, "16:01"],
      [0, "16:00"],
      [10, "15:59"],
    ])(
      "Should accrue 10 points if the time of purchase is after 2:00pm and before 4:00pm. [points: %i, string: %s]",
      (points, timeStr) => {
        expect(PointCalculation.purchaseTime(timeStr)).toBe(points);
      }
    );
    it.each(["01:83", "25:00"])(
      "Should throw an error for erroneous timestrings",
      (badTimeStr) => {
        expect(() => PointCalculation.purchaseTime(badTimeStr)).toThrowError();
      }
    );
  });
});
