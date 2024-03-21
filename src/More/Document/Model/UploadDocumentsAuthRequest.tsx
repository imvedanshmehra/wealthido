export class UploadDocumentsAuthRequest {
  documentName: string;
  uploadDocument: { image: string; type: string }[];

  constructor(
    documentName: string,
    uploadDocument: { image: string; type: string }[]
  ) {
    this.documentName = documentName;
    this.uploadDocument = uploadDocument;
  }
}
