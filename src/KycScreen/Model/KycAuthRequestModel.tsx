export class KycAuthRequestModel {
  id: number;
  front: string;
  back: string;
  selfie: string;

  constructor(id: number, front: string, back: string, selfie: string) {
    this.id = id;
    this.front = front;
    this.back = back;
    this.selfie = selfie;
  }
}
