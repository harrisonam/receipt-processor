import {
  ReceiptItem,
  ReceiptDateStringFormat,
  ReceiptTimeStringFormat,
} from "../../dtos/receipt-response.dto";

export class PointCalculation {
  /**
   * One point for every alphanumeric character in the retailer name.
   */
  static alphanumeric(retailName: string): number {
    const alphanumericRegex = /[a-zA-Z0-9]/g;
    const matches = retailName.match(alphanumericRegex);

    return matches ? matches.length : 0;
  }

  /**
   * 50 points if the total is a round dollar amount with no cents.
   */
  static checkRoundedTotal(totalAmount: number): number {
    return totalAmount % 1 > 0.0 ? 0 : 50;
  }

  /**
   * 25 points if the total is a multiple of 0.25.
   */
  static multipleOf25(totalAmount: number): number {
    return totalAmount % 0.25 === 0 ? 25 : 0;
  }

  /**
   *  5 points for every two items on the receipt.
   */
  static countTwoItems(itemLength: number): number {
    return Math.floor(itemLength / 2) * 5;
  }

  /**
   * If the trimmed length of the item description is a multiple of 3,
   * multiply the price by 0.2 and round up to the nearest integer.
   * The result is the number of points earned.
   */
  static trimmedItemDescriptionMultiple(params: ReceiptItem) {
    const trimmed = params.shortDescription.trim();
    return trimmed.length % 3 === 0 ? Math.ceil(0.2 * params.price) : 0;
  }

  /**
   * 6 points if the day in the purchase date is odd.
   */
  static oddPurchaseDate(dateStr: string): number {
    if (!ReceiptDateStringFormat.test(dateStr)) throw Error("Bad Date String");
    const day = parseInt(dateStr.substring(dateStr.length - 2, dateStr.length));
    return day % 2 !== 0 ? 6 : 0;
  }

  /**
   * 10 points if the time of purchase is after 2:00pm and before 4:00pm.
   */
  static purchaseTime(timeStr: string) {
    if (!ReceiptTimeStringFormat.test(timeStr)) throw Error("Bad Time String");
    const hour = parseInt(timeStr.substring(0, 2));
    return hour >= 14 && hour < 16 ? 10 : 0;
  }
}
