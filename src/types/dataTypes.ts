import { Document } from "@langchain/core/documents";

export type Message = {
    messageId: string;
    chatId: string | "";
    createdAt: Date;
    content: string;
    asterResponse: AgentResponse | null;
    asterBrowseLiveStreamUrl: string | null;
    browserUrl: string | null,
    messageType: 'search' | 'aster_browse'
    role: 'user' | 'assistant';
    suggestions?: string[] | null;
    sources?: Document[] | null;
}

// export type AsterMessage = {
//     messageId: string;
//     chatId: string | "";
//     createdAt: Date;
//     agentResponse: agent_response;
//     content: "No Content Aster Message";
//     browserUrl: string;
//     role: 'user' | 'assistant';
// }

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
  
export type AgentResponse = {
  [key: string]: AgentIteration
}

export type AgentIteration = {
  action: Array<Record<string, unknown>>;
  current_state: {
    evaluation_previous_goal: string;
    memory: string;
    next_goal: string;
    reasoning?: string;
  };
};