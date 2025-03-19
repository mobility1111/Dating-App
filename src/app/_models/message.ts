// export interface Message {
//     id: number;
//     senderId: number;
//     senderUsername: string;
//     senderPhotoUrl: string;
//     recipientId: number;
//     recipientUsername: string;
//     recipientPhotoUrl: string;
//     content: string;
//     dateRead?: Date;
//     messageSent: Date;
// }


export interface Message {
    id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl: string | null;
    recipientId: number;
    recipientUsername: string;
    recipientPhotoUrl: string | null;
    content: string;
    dateRead: string | null;
    messageSent: string;
  }
  