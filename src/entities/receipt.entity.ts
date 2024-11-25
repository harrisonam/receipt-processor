export class ReceiptEntity {
  points: number;

  constructor(params: { points: number }) {
    this.points = params.points;
  }
}
