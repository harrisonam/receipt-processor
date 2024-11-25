import {
  IsString,
  IsNumber,
  IsNumberOptions,
  IsArray,
  IsInstance,
  Matches,
  ValidateNested,
} from "class-validator";
import { Expose, Transform, Type } from "class-transformer";

const priceNumberOptions: IsNumberOptions = {
  allowNaN: false,
  allowInfinity: false,
  maxDecimalPlaces: 2,
};

// This will match yyyy-mm-dd and also yyyy-m-d
export const ReceiptDateStringFormat =
  /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

// This will mach HH:MM time
export const ReceiptTimeStringFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ReceiptItem {
  @Expose()
  @IsString()
  shortDescription!: string;

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber(priceNumberOptions)
  price!: number;
}

export class ReceiptResponseDTO {
  @Expose()
  @IsString()
  retailer!: string;

  @Expose()
  @Matches(ReceiptDateStringFormat)
  purchaseDate!: string;

  @Expose()
  @Matches(ReceiptTimeStringFormat)
  purchaseTime!: string;

  @Expose()
  @Type(() => ReceiptItem)
  @IsArray()
  @IsInstance(ReceiptItem, { each: true })
  @ValidateNested()
  items!: ReceiptItem[];

  @Expose()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber(priceNumberOptions)
  total!: number;
}
