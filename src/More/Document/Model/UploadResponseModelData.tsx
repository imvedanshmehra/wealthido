export type UploadResponseModelData = {
  createdAt?: Date;
  documentName?: string;
  id?: number;
  images?: Images;
  status?: string;
  updatedAt?: Date;
};

export type Images = {
  image1?: string;
  image2?: null;
  image3?: null;
  image4?: null;
  image5?: null;
};
