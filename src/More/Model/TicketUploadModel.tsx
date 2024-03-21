export interface TicketUploadModel {
    data?:    TicketUploadModelData;
    message?: string;
    status?:  number;
    success?: boolean;
}

export interface TicketUploadModelData {
    image?:    string;
    view_url?: string;
    fileType?: string;
}