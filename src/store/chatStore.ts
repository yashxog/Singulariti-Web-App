import { create } from "zustand";
import { Message, Session } from "@/types/dataTypes";
import crypto from "crypto";

interface ChatState {
  chatId?: string;
  newChatCreated: boolean;
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

  // Actions
  setChatId: (chatId?: string) => void;
  setNewChatCreated: (value: boolean) => void;
  setIsReady: (value: boolean) => void;
  setIsLimit: (value: boolean) => void;
  setTimeLeft: (value: string) => void;
  setChatHistory: (history: [string, string][]) => void;
  setMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  updateMessageContent: (messageId: string, content: string) => void;
  setLoading: (value: boolean) => void;
  setMessageAppeared: (value: boolean) => void;
  setFocusMode: (mode: string) => void;
  setIsMessagesLoaded: (value: boolean) => void;
  setNotFound: (value: boolean) => void;
  addToChatHistory: (human: string, assistant: string) => void;
  updateMessageSuggestions: (messageId: string, suggestions: string[]) => void;
  initializeNewChat: () => string; // New action
  resetChat: () => void; // New action
}

export const useChatStore = create<ChatState>((set) => ({
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

  setChatId: (chatId) => set({ chatId }),
  setNewChatCreated: (value) => set({ newChatCreated: value }),
  setIsReady: (value) => set({ isReady: value }),
  setIsLimit: (value) => set({ isLimit: value }),
  setTimeLeft: (value) => set({ timeLeft: value }),
  setChatHistory: (history) => set({ chatHistory: history }),
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessageContent: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.messageId === messageId ? { ...msg, content: msg.content + content } : msg
      ),
    })),
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
}));