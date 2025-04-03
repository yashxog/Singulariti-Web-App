'use client';

import { toast } from "sonner";
import { Document } from "@langchain/core/documents";
import { getSuggestions } from "@/lib/action";
import { useChatStore } from "@/store/chatStore";
import { useWebSocketStore } from "@/store/webSocketStore";
import crypto from "crypto";

export const createSendMessageFunction = (messagesRef: React.MutableRefObject<any[]>) => {
  return async (message: string, isNewChat = false) => {
    const chatStore = useChatStore.getState();
    const wsStore = useWebSocketStore.getState();

    if (chatStore.loading) return;

    chatStore.setLoading(true);
    chatStore.setMessageAppeared(false);

    let sources: Document[] | undefined = undefined;
    let receivedMessage = '';
    let added = false;

    const messageId = crypto.randomBytes(7).toString('hex');
    const currentChatId = chatStore.chatId || crypto.randomBytes(16).toString('hex');

    const selectedWs = wsStore.useAster ? wsStore.asterWs : wsStore.ws;

    if (!selectedWs || selectedWs.readyState !== WebSocket.OPEN) {
      toast.error("Connection not ready");
      chatStore.setLoading(false);
      return currentChatId;
    }

    // Send the message via WebSocket
    try {
      if (wsStore.useAster) {
        selectedWs?.send(
          JSON.stringify({
            type: 'aster_browse',
            message: {
              chatId: currentChatId,
              content: message,
            },
          })
        );
      } else {
        selectedWs?.send(
          JSON.stringify({
            type: 'message',
            message: {
              chatId: currentChatId,
              content: message,
            },
            focusMode: chatStore.focusMode,
            history: [...chatStore.chatHistory, ['human', message]],
          }),
        );
      }

      // Append user message to the chat
      if (wsStore.useAster) {
        chatStore.appendMessage({
          content: message,
          asterResponse: null,
          messageId: messageId,
          chatId: currentChatId,
          role: 'user',
          messageType: 'aster_browse',
          browserUrl: null,
          createdAt: new Date(),
        });
        chatStore.setCurrentMessageType("aster_browse")
      } else {
        chatStore.appendMessage({
          content: message,
          asterResponse: null,
          messageId: messageId,
          chatId: currentChatId,
          role: 'user',
          messageType: 'search',
          browserUrl: null,
          createdAt: new Date(),
        });
        chatStore.setCurrentMessageType("search")
      }


      // For new chats, mark that we're creating a new chat
      if (isNewChat) {
        chatStore.setWaitingForFirstResponse(true);
      }

      // Create message handler
      const messageHandler = async (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);

          if (data.type === "error") {
            chatStore.setLoading(false);
            toast.error(data.data);
            return;
          }

          if (data.type === "rateLimit") {
            chatStore.setLoading(false);
            chatStore.setIsLimit(false);
            chatStore.setTimeLeft(data.resetAfter);
            return;
          }

          if (data.type === 'sources') {
            sources = data.data;
            if (!added) {
              chatStore.appendMessage({
                content: '',
                asterResponse: null,
                messageId: data.messageId,
                chatId: currentChatId,
                role: 'assistant',
                messageType: 'search',
                browserUrl: null,
                sources: sources,
                createdAt: new Date(),
              });
              added = true;
            }
            chatStore.setMessageAppeared(true);
          }

          if (data.type === 'message') {
            if (!added) {
              chatStore.appendMessage({
                content: data.data,
                messageId: data.messageId,
                asterResponse: null,
                chatId: currentChatId,
                role: 'assistant',
                messageType: 'search',
                browserUrl: null,
                sources: sources,
                createdAt: new Date(),
              });
              added = true;
            } else {
              chatStore.updateMessageContent(data.messageId, data.data);
            }
            receivedMessage += data.data;
            chatStore.setMessageAppeared(true);
          }

          if (data.type === "aster_message") {
            if (!added) {
              chatStore.appendMessage({
                content: "No Content Aster Message",
                asterResponse: { Step1: data.data.agentResponse },
                messageId: data.data.messageId,
                chatId: currentChatId,
                role: 'assistant',
                messageType: 'aster_browse',
                browserUrl: "COMMING_SOON",
                createdAt: new Date(),
              });
              added = true;
            } else {
              chatStore.updateAsterMessageContent(data.data.messageId, data.data.agentResponse)
              chatStore.setLoading(false)
            }
            chatStore.setMessageAppeared(true);
          }

          if (data.type === 'messageEnd') {
            chatStore.addToChatHistory(message, receivedMessage);

            // If this is a new chat, set document title based on first message
            if (isNewChat && chatStore.messages.length > 0) {
              document.title = message;
            }

            selectedWs?.removeEventListener('message', messageHandler);
            chatStore.setLoading(false);

            // Reset waiting for first response flag if it was set
            if (chatStore.waitingForFirstResponse) {
              chatStore.setWaitingForFirstResponse(false);
            }

            // If we have a messagesRef, get suggestions
            if (messagesRef?.current) {
              const lastMsg = messagesRef.current[messagesRef.current.length - 1];
              if (
                lastMsg?.role === 'assistant' &&
                lastMsg?.sources &&
                lastMsg?.sources.length > 0 &&
                !lastMsg?.suggestions
              ) {
                try {
                  const suggestions = await getSuggestions(messagesRef.current);
                  chatStore.updateMessageSuggestions(lastMsg.messageId, suggestions);
                } catch (error) {
                  console.error("Failed to get suggestions:", error);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error handling WebSocket message:", error);
          chatStore.setLoading(false);
        }
      };

      // Add the message handler to the WebSocket
      selectedWs?.addEventListener('message', messageHandler);
    } catch (error) {
      console.error("Error sending message via WebSocket:", error);
      chatStore.setLoading(false);
      toast.error("Failed to send message");
    }

    // Return the chat ID in case it's needed (especially for new chats)
    return currentChatId;
  };
};