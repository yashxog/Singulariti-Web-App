import { Document } from "@langchain/core/documents";

export type Message = {
    messageId: string;
    chatId: string | "";
    createdAt: Date;
    content: string;
    role: 'user' | 'assistant';
    suggestions?: string[];
    sources?: Document[];
}

export type Session = {
    accessToken: string;
    expires: string;
    jwt: {
      name: string;
      email: string;
      id: string;
      accessToken: string;
      iat: number;
      exp: number;
    };
    user: {
      name: string;
      email: string;
      image: string;
      id: string;
    }
  }
  