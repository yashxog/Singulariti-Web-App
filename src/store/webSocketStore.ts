import { create } from 'zustand';

interface WebSocketState {
  ws: WebSocket | null;
  isWSReady: boolean;
  hasError: boolean;
  useAster: boolean;
  
  // Actions
  setIsWsReady: (value: boolean) => void;
  setError: (value: boolean) => void;
  toggleWebSocket: () => void;
  resetError: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  ws: null,
  isWSReady: false,
  hasError: false,
  useAster: false,

  setIsWsReady: (value) => set({ isWSReady: value }),
  setError: (value) => set({ hasError: value }),
  toggleWebSocket: () => set((state) => ({ useAster: !state.useAster })),
  resetError: () => set({ hasError: false }),
}));