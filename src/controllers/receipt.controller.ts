import { Request, Response } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Container } from "typedi";
import { ReceiptResponseDTO } from "../dtos/receipt-response.dto";
import { ReceiptService } from "../services/receipt.service";

const receiptService = Container.get(ReceiptService);

export async function createReceiptRecord(
  req: Request,
  res: Response,
) {
  const receiptDTO = plainToClass(ReceiptResponseDTO, req.body, {
    excludeExtraneousValues: true,
  });
  const validationErrors = await validate(receiptDTO);
  if (validationErrors.length) {
    return res.status(400).send("The receipt is invalid");
  }
  const id = receiptService.create(receiptDTO);
  return res.json({ id });
}

export function getReceiptRecord(req: Request, res: Response) {
  const { id } = req.params;
  const record = receiptService.find(id);
  if (record === undefined) {
    res.status(404).send("No receipt found for that id");
  } else {
    const { points } = record;
    res.json({ points });
  }
}
