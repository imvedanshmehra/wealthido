export class TicketRaiseRequestModel {
  title: string;
  category: string;
  description: string;
  images?: { file: string; fileType: string }[];

  constructor(
    title: string,
    category: string,
    description: string,
    image1?: { file: string; fileType: string } | undefined | null,
    image2?: { file: string; fileType: string } | undefined | null,
    image3?: { file: string; fileType: string } | undefined | null
  ) {
    this.title = title;
    this.category = category;
    this.description = description;
    this.images = [];

    if (image1) {
      this.images.push(image1);
    }
    if (image2) {
      this.images.push(image2);
    }
    if (image3) {
      this.images.push(image3);
    }
  }
}

export class ReplyTicketRaiseRequestModel {
  description: string;
  images?: { file: string; fileType: string }[];

  constructor(
    description: string,
    image1?: { file: string; fileType: string } | undefined | null,
    image2?: { file: string; fileType: string } | undefined | null,
    image3?: { file: string; fileType: string } | undefined | null
  ) {
    this.description = description;
    this.images = [];

    if (image1) {
      this.images.push(image1);
    }
    if (image2) {
      this.images.push(image2);
    }
    if (image3) {
      this.images.push(image3);
    }
  }
}
