import crypto from "crypto";
import { Service } from "typedi";

import { ReceiptResponseDTO } from "../dtos/receipt-response.dto";
import { ReceiptEntity } from "../entities/receipt.entity";
import { PointCalculation } from "./helpers/receipt-point-calculation";

type ReceiptID = string;

@Service()
export class ReceiptService {
  records: Map<string, ReceiptEntity>;

  constructor() {
    // NOTE: Per the API, this will suffice for storage in ou  API,
    // rather than having a persistent DB
    this.records = new Map();
  }

  /**
   *
   * @param receipt uses receipt DTO
   * @returns Total points awarded for the receipt
   */
  calculatePoints(receipt: ReceiptResponseDTO): number {
    let points = 0;

    points += PointCalculation.alphanumeric(receipt.retailer);
    points += PointCalculation.checkRoundedTotal(receipt.total);
    points += PointCalculation.multipleOf25(receipt.total);
    points += PointCalculation.countTwoItems(receipt.items.length);
    for (const item of receipt.items) {
      points += PointCalculation.trimmedItemDescriptionMultiple(item);
    }
    points += PointCalculation.oddPurchaseDate(receipt.purchaseDate);
    points += PointCalculation.purchaseTime(receipt.purchaseTime);

    return points;
  }

  /**
   *
   * @param points
   * @returns ReceiptID
   */
  create(receipt: ReceiptResponseDTO): ReceiptID {
    const id: string = crypto.randomUUID();
    const points = this.calculatePoints(receipt);
    const record = new ReceiptEntity({ points });
    this.records.set(id, record);
    return id;
  }

  /**
   *
   * @param id ID to return from the records
   * @returns record if it exists, else undefined
   */
  find(id: ReceiptID): ReceiptEntity | undefined {
    return this.records.get(id);
  }
}
