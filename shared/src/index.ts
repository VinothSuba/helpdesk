export type TicketStatus = "open" | "resolved" | "closed";

export type TicketCategory = "general" | "technical" | "refund_request";

export type UserRole = "admin" | "agent";

export type MessageSenderType = "customer" | "agent" | "ai";

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  body: string;
  status: TicketStatus;
  category: TicketCategory;
  senderEmail: string;
  assignedToId: string | null;
  aiSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string | null;
  senderType: MessageSenderType;
  body: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
