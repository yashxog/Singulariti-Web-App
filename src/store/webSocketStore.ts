import { create } from 'zustand';

interface WebSocketState {
  ws: WebSocket | null;
  asterWs: WebSocket | null;
  isWsReady: boolean;
  isAsterWsReady: boolean;
  hasError: boolean;
  useAster: boolean;

  // Actions
  toggleWebSocket: () => void;
  setWs: (ws: WebSocket | null) => void;
  setAsterWs: (asterWs: WebSocket | null) => void;
  setIsWsReady: (ready: boolean, isAster: boolean) => void;
  setError: (error: boolean) => void;
  resetError: () => void;
  resetWs: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  ws: null,
  asterWs: null,
  isWsReady: false,
  isAsterWsReady: false,
  hasError: false,
  useAster: false,
  toggleWebSocket: () => set((state) => ({ useAster: !state.useAster })),
  setWs: (ws) => set({ ws }),
  setAsterWs: (asterWs) => set({ asterWs }),
  setIsWsReady: (ready, isAster) => set((state) => ({
    isWsReady: isAster ? state.isWsReady : ready,
    isAsterWsReady: isAster ? ready : state.isAsterWsReady
  })),
  setError: (error) => set({ hasError: error }),
  resetError: () => set({ hasError: false }),
  resetWs: () => set({ws: null, asterWs: null, isWsReady: false, isAsterWsReady: false, hasError: false, useAster: false,})
}));