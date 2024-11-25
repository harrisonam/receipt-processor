import { ReceiptService } from "./receipt.service";
import { ReceiptResponseDTO } from "../dtos/receipt-response.dto";

describe("ReceiptService", () => {
  let receiptService: ReceiptService;
  let dto1: ReceiptResponseDTO, dto2: ReceiptResponseDTO;

  beforeEach(() => {
    receiptService = new ReceiptService();
    dto1 = new ReceiptResponseDTO();
    dto1.retailer = "Target";
    dto1.purchaseDate = "2022-01-01";
    dto1.purchaseTime = "13:01";
    dto1.items = [
      {
        shortDescription: "Mountain Dew 12PK",
        price: 6.49,
      },
      {
        shortDescription: "Emils Cheese Pizza",
        price: 12.25,
      },
      {
        shortDescription: "Knorr Creamy Chicken",
        price: 1.26,
      },
      {
        shortDescription: "Doritos Nacho Cheese",
        price: 3.35,
      },
      {
        shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
        price: 12.0,
      },
    ];
    dto1.total = 35.35;

    dto2 = new ReceiptResponseDTO();

    dto2.retailer = "M&M Corner Market";
    dto2.purchaseDate = "2022-03-20";
    dto2.purchaseTime = "14:33";
    dto2.items = [
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
      {
        shortDescription: "Gatorade",
        price: 2.25,
      },
    ];
    dto2.total = 9.0;
  });

  it("should create a records Map on construction", () => {
    receiptService = new ReceiptService();
    expect(receiptService).toHaveProperty("records");
    expect(receiptService.records).toBeInstanceOf(Map);
  });
  describe("calculatePoints", () => {
    it("should calculate points properly", () => {
      expect(receiptService.calculatePoints(dto1)).toBe(28.0);
      expect(receiptService.calculatePoints(dto2)).toBe(109);
    });
  });
  describe("record management", () => {
    it("create should properly store a record and return a string UUID", () => {
      const id = receiptService.create(dto1);
      expect(typeof id).toBe("string");
      expect(receiptService.records.has(id)).toBe(true);
      expect(receiptService.find(id)).toHaveProperty("points");
      expect(receiptService.find(id)).toEqual({ points: 28 });
    });
  });
});
