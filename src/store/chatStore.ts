import { create } from "zustand";
import { Message, AgentIteration } from "@/types/dataTypes";
import crypto from "crypto";
import { Document } from "@langchain/core/documents";

interface ChatState {
  chatId?: string;
  newChatCreated: boolean;
  waitingForFirstResponse: boolean,
  isReady: boolean;
  isLimit: boolean;
  timeLeft: string;
  chatHistory: [string, string][];
  messages: Message[];
  loading: boolean;
  messageAppeared: boolean;
  focusMode: string;
  isMessagesLoaded: boolean;
  notFound: boolean;
  currentMessageType: "search" | "aster_browse" | null;

  // Actions
  setChatId: (chatId?: string) => void;
  setNewChatCreated: (value: boolean) => void;
  setWaitingForFirstResponse: (waiting: boolean) => void;
  setIsReady: (value: boolean) => void;
  setIsLimit: (value: boolean) => void;
  setTimeLeft: (value: string) => void;
  setChatHistory: (history: [string, string][]) => void;
  setMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  updateMessageContent: (messageId: string, content: string) => void;
  updateAsterMessageContent: (messageId: string, message: AgentIteration) => void;
  setLoading: (value: boolean) => void;
  setMessageAppeared: (value: boolean) => void;
  setFocusMode: (mode: string) => void;
  setIsMessagesLoaded: (value: boolean) => void;
  setNotFound: (value: boolean) => void;
  addToChatHistory: (human: string, assistant: string) => void;
  updateMessageSuggestions: (messageId: string, suggestions: string[]) => void;
  updateMessageSources: (messageId: string, sources: Document[] | undefined) => void;
  initializeNewChat: () => string; // New action
  resetChat: () => void; // New action
  setCurrentMessageType: (messageType: "search" | "aster_browse" | null) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: undefined,
  newChatCreated: false,
  waitingForFirstResponse: false,
  isReady: false,
  isLimit: true,
  timeLeft: '',
  chatHistory: [],
  messages: [],
  loading: false,
  messageAppeared: false,
  focusMode: 'webSearch',
  isMessagesLoaded: false,
  notFound: false,
  currentMessageType: null,

  setChatId: (chatId) => set({ chatId }),
  setNewChatCreated: (value) => set({ newChatCreated: value }),
  setWaitingForFirstResponse: (waiting: boolean) => set({ waitingForFirstResponse: waiting }),
  setIsReady: (value) => set({ isReady: value }),
  setIsLimit: (value) => set({ isLimit: value }),
  setTimeLeft: (value) => set({ timeLeft: value }),
  setChatHistory: (history) => set({ chatHistory: history }),
  setMessages: (messages) => set({ messages }),

  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateMessageContent: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((msg) => {

        return msg.messageId === messageId &&
          msg.role === "assistant" &&
          "content" in msg
          ? { ...msg, content: msg.content + content }
          : msg;
      }),
    })),

  updateAsterMessageContent: (messageId, message: AgentIteration) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.messageId === messageId && msg.role === 'assistant' && msg.messageType === 'aster_browse') {
          const currentSteps = msg.asterResponse || {};

          const stepKeys = Object.keys(currentSteps).filter((key) =>
            /^step\d+$/i.test(key)
          );
          const nextStepNumber = stepKeys.length + 1;
          const nextStepKey = `Step${nextStepNumber}`;
          return {
            ...msg,
            asterResponse: {
              ...currentSteps,
              [nextStepKey]: message  // This merges the new step into the existing asterResponse
            }
          };
        }
        return msg;
      })
    }))
  },

  setLoading: (value) => set({ loading: value }),
  setMessageAppeared: (value) => set({ messageAppeared: value }),
  setFocusMode: (mode) => set({ focusMode: mode }),
  setIsMessagesLoaded: (value) => set({ isMessagesLoaded: value }),
  setNotFound: (value) => set({ notFound: value }),

  addToChatHistory: (human, assistant) =>
    set((state) => ({ chatHistory: [...state.chatHistory, [human, assistant]] })),

  updateMessageSuggestions: (messageId, suggestions) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.messageId === messageId ? { ...msg, suggestions } : msg
      ),
    })),

  initializeNewChat: () => {
    const newChatId = crypto.randomBytes(20).toString('hex');
    set({
      chatId: newChatId,
      newChatCreated: true,
      isMessagesLoaded: true,
      messages: [],
      chatHistory: []
    })
    return newChatId;
  },

  updateMessageSources: (messageId: string, sources: Document[] | undefined) => {
    set((state) => ({
      messages: state.messages.map((message) => {
        if (message.messageId === messageId) {
          return {
            ...message,
            sources,
          };
        }
        return message;
      }),
    }));
  },

  resetChat: () => set({
    chatId: undefined,
    newChatCreated: false,
    isReady: false,
    isLimit: true,
    timeLeft: '',
    chatHistory: [],
    messages: [],
    loading: false,
    messageAppeared: false,
    focusMode: 'webSearch',
    isMessagesLoaded: false,
    notFound: false,
  }),

  setCurrentMessageType: (messageType: "search" | "aster_browse" | null) => set({ currentMessageType: messageType })
}));