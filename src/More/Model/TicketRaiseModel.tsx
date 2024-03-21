export interface TicketRaiseModel {
    message?: string;
    success?: boolean;
    status?:  number;
    data?:    TicketRaiseModelData;
}

export interface TicketRaiseModelData {
    id?:          number;
    ticketId?:    string;
    category?:    string;
    title?:       string;
    messageList?: MessageList[];
    userId?:      number;
    status?:      string;
    createdAt?:   Date;
    updatedAt?:   Date;
}

export interface MessageList {
    id?:          number;
    description?: string;
    username?:    string;
    createdAt?:   Date;
    updatedAt?:   Date;
    image?:       Image;
}

export interface Image {
    id?:         number;
    firstFile?:  string;
    secondFile?: string;
    thirdFile?:  string;
    updatedAt?:  Date;
    createdAt?:  Date;
}

