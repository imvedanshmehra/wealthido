export type TicketResponseData = {
  list?: TicketResponseDataList[];
  messageList?: TicketResponseMessageList[];
  id?: number;
  ticketId?: string;
  category?: string;
  title?: string;
  userID?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TicketResponseDataList = {
  id?: number;
  ticketId?: string;
  category?: string;
  title?: string;
  messageList?: TicketResponseMessageList[];
  userID?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TicketResponseMessageList = {
  id?: number;
  description?: string;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
  image?: TicketResponseImage[];
};

export type TicketResponseImage = {
    file:     string;
    fileType: string;
};
