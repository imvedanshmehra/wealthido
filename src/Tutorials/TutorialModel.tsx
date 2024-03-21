export interface TutorialModelResponse {
  message: string;
  success: boolean;
  status: number;
  data: TutorialModelResponseDatum[];
}

export interface TutorialModelResponseDatum {
  id: number;
  link: string;
  title: string | null;
  category: string;
  status: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
