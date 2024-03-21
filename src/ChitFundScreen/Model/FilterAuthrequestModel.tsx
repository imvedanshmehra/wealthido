export class FilterAuthRequestModel {
  page: number;
  limit: number;
  chitStatus: string;
  startValue: number | null | undefined;
  endValue: number | null | undefined;
  duration: number | null | undefined;
  startAmount: number | null | undefined;
  endAmount: number | null | undefined;

  constructor(
    startValue: number | null,
    endValue: number | null,
    duration: number | null,
    startAmount: number | null,
    endAmount: number | null
  ) {
    this.page = 1;
    this.limit = 100;
    this.chitStatus = "UPCOMING";
    if (startValue) {
      this.startValue = startValue;
    }
    if (endValue) {
      this.endValue = endValue;
    }
    if (duration) {
      this.duration = duration;
    }
    if (startAmount) {
      this.startAmount = startAmount;
    }
    if (endAmount) {
      this.endAmount = endAmount;
    }
  }
}
