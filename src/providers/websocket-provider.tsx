'use client'

import { useEffect, useRef, useState } from 'react';
import { useWebSocketStore } from '@/store/webSocketStore';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const wsURL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "wss://singulariti-answer-engine-v1.onrender.com";
const wsBrowseURL = process.env.NEXT_PUBLIC_ASTER_BROWSE_URL;

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const {
    setWs,
    setAsterWs,
    setIsWsReady,
    setError,
    resetError,
    ws,
    asterWs
  } = useWebSocketStore();
  const visibilityTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const connectWebSocket = async (url: string, isAster = false): Promise<WebSocket | null> =>  {
    if (!url) return null;

    // Fetch model configuration
    let chatModelProvider = localStorage.getItem("chatModelProvider");
    let embeddingModelProvider = localStorage.getItem("embeddingModelProvider");
    let chatModel = localStorage.getItem("chatModel");
    let embeddingModel = localStorage.getItem("embeddingModel");

    if (!chatModelProvider || !embeddingModelProvider || !chatModel || !embeddingModel) {
      const providers = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/models`, {
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json());

      chatModelProvider = Object.keys(providers.chatModelProviders)[0];
      chatModel = Object.keys(providers.chatModelProviders[chatModelProvider])[0];
      embeddingModelProvider = Object.keys(providers.embeddingModelProviders)[0];
      embeddingModel = Object.keys(providers.embeddingModelProviders[embeddingModelProvider])[0];

      localStorage.setItem("chatModel", chatModel);
      localStorage.setItem("chatModelProvider", chatModelProvider);
      localStorage.setItem("embeddingModel", embeddingModel);
      localStorage.setItem("embeddingModelProvider", embeddingModelProvider);
    }

    const wsUrl = new URL(url);
    const params = new URLSearchParams({
      chatModel,
      chatModelProvider,
      embeddingModel,
      embeddingModelProvider,
      ...(chatModelProvider === "custom_openai" && {
        openAIApiKey: localStorage.getItem("openAIApiKey") || '',
        openAIBaseURL: localStorage.getItem("openAIBaseURL") || ''
      })
    });

    wsUrl.search = params.toString();

    const connection = new WebSocket(wsUrl.toString());
    connection.onopen = () => {
      setIsWsReady(true, isAster);
      resetError();
      
      if (session?.user) {
        console.log("SESSION FOUND")
        connection.send(JSON.stringify({
          type: "auth",
          token: session.jwt
        }));
      } else{
        console.log("SESSION NOT FOUND!")
      }
    };

    connection.onerror = () => {
      setError(true);
      toast.error("WebSocket connection error");
    };

    connection.onclose = () => {
      setIsWsReady(false, isAster);
      if (isMounted.current) {
        toast.warning("Connection closed, reconnecting...");
        setTimeout(() => connectWebSocket(url, isAster), 5000);
      }
    };

    return connection;
  };

  // Handle session loading state
  useEffect(() => {
    if (status !== 'loading') {
      setIsSessionLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    if (!isSessionLoaded)  {
      console.log("SESSION NOT LOADED")
      return;
    }

    isMounted.current = true;
  
    const connect = async () => {
      try {
        const mainWs = await connectWebSocket(wsURL);
        setWs(mainWs);
      } catch (error) {
        console.error("Failed to connect to main server: ", error);
      }
  
      try {
        const asterWs = await connectWebSocket(wsBrowseURL!, true);
        setAsterWs(asterWs);
      } catch (error) {
        console.error("Failed to connect to aster server:", error);
      }
    };
  
    connect();
  
    return () => {
      isMounted.current = false;
      [ws, asterWs].forEach(conn => {
        if (conn && conn.readyState === WebSocket.OPEN) {
          conn.close();
          console.log("WebSocket connection closed");
        }
      });
    };
  }, [isSessionLoaded]);

  useEffect(() => {
    if (session?.user) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: "auth",
          token: session.jwt
        }));
      }
      if (asterWs && asterWs.readyState === WebSocket.OPEN) {
        asterWs.send(JSON.stringify({
          type: "auth",
          token: session.jwt
        }));
      }
    }
  }, [session, ws, asterWs]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        visibilityTimeout.current = setTimeout(() => {
          [ws, asterWs].forEach(conn => conn?.close());
        }, 300000); // 5 minutes timeout
      } else {
        if (visibilityTimeout.current) {
          clearTimeout(visibilityTimeout.current);
          visibilityTimeout.current = null;
        }
        // Reconnect if closed
        if (!ws || ws.readyState === WebSocket.CLOSED) connectWebSocket(wsURL);
        if (!asterWs || asterWs.readyState === WebSocket.CLOSED) connectWebSocket(wsBrowseURL!, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [ws, asterWs]);

  return children;
};
