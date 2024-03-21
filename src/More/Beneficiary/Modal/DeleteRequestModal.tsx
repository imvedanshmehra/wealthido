export class DeleteRequestModal {
  id1: number | null;
  id2: number | null;
  id3: number | null;
  id4: number | null;
  id5: number | null;
  percentage1: number;
  percentage2: number;
  percentage3: number;
  percentage4: number;
  percentage5: number;

  constructor(
    id1: number | null,
    id2: number | null,
    id3: number | null,
    id4: number | null,
    id5: number | null,
    percentage1: number,
    percentage2: number,
    percentage3: number,
    percentage4: number,
    percentage5: number
  ) {
    this.id1 = id1;
    this.id2 = id2;
    this.id3 = id3;
    this.id4 = id4;
    this.id5 = id5;
    this.percentage1 = percentage1;
    this.percentage2 = percentage2;
    this.percentage3 = percentage3;
    this.percentage4 = percentage4;
    this.percentage5 = percentage5;
  }
}
