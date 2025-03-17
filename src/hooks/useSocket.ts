// import { useEffect, useState, useRef } from "react";
// import { Session } from "@/types/dataTypes";
// import { toast } from "sonner";
// import { useWebSocketStore } from "@/store/webSocketStore";

// const backendAPI = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// export const useSocket = (url: string, session: Session | null) => {
//   const [ws, setWs] = useState<WebSocket | null>(null)
//   const sessionRef = useRef(session)
//   const { hasError, setIsWsReady, setError, resetError } = useWebSocketStore()

//   useEffect(() => {
//     sessionRef.current = session
//   }, [session]) //*** */

//   useEffect(() => {
//     console.log("SOCKET HAS ERROR: ", hasError)
//     if(hasError == true){
//       resetError()
//     }
//   }, [])

//   useEffect(() => {
//     if (!ws) {
//       const connectWs = async () => {
//         let chatModelProvider = localStorage.getItem("chatModelProvider")
//         let embeddingModelProvider = localStorage.getItem("embeddingModelProvider")
//         let chatModel = localStorage.getItem("chatModel")
//         let embeddingModel = localStorage.getItem("embeddingModel")

//         if (!chatModelProvider || !embeddingModelProvider || !chatModel || !embeddingModel) {
//           const providers = await fetch(`${backendAPI}/models`, {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }).then(async (res) => await res.json())

//           const embeddingModelProviders = providers.embeddingModelProviders

//           chatModelProvider = Object.keys(providers.chatModelProviders)[0]
//           chatModel = Object.keys(providers.chatModelProviders[chatModelProvider])[0]

//           embeddingModelProvider = Object.keys(embeddingModelProviders)[0]
//           embeddingModel = Object.keys(embeddingModelProviders[embeddingModelProvider])[0]

//           localStorage.setItem("chatModel", chatModel!)
//           localStorage.setItem("chatModelProvider", chatModelProvider)
//           localStorage.setItem("embeddingModel", embeddingModel!)
//           localStorage.setItem("embeddingModelProvider", embeddingModelProvider)
//         }

//         const wsURL = new URL(url)
//         const searchParams = new URLSearchParams({})

//         searchParams.append("chatModel", chatModel!)
//         searchParams.append("chatModelProvider", chatModelProvider)

//         if (chatModelProvider === "custom_openai") {
//           searchParams.append("openAIApiKey", localStorage.getItem("openAIApiKey")!)
//           searchParams.append("openAIBaseURL", localStorage.getItem("openAIBaseURL")!)
//         }

//         searchParams.append("embeddingModel", embeddingModel)
//         searchParams.append("embeddingModelProvider", embeddingModelProvider)

//         wsURL.search = searchParams.toString()

//         const ws = new WebSocket(wsURL.toString())

//         const timeoutId = setTimeout(() => {
//           if (ws.readyState !== 1) {
//             toast.error("Failed to connect to the server. Please try again later.")
//           }
//         }, 10000)

//         ws.onopen = () => {
//           console.log("web socket connection open")
//           clearTimeout(timeoutId)
//           setIsWsReady(true)
//           resetError()
//           if (sessionRef.current?.user) {
//             ws.send(
//               JSON.stringify({
//                 type: "auth",
//                 token: sessionRef.current?.jwt,
//               }),
//             )
//           }
//         }

//         ws.onerror = () => {
//           console.log("SOCKET STATE ERROR: ", hasError)
//           clearTimeout(timeoutId)
//           setError(true)
//           toast.error("WebSocket connection error.")
//         }

//         ws.onclose = () => {
//           console.log("SOCKET STATE CLOSE: ", hasError)
//           clearTimeout(timeoutId)
//           setError(true)
//           console.log("web socket connection closed")
//         }

//         ws.addEventListener("message", (e) => {
//           const parsedData = JSON.parse(e.data)
//           if (parsedData.type === "error") {
//             toast.error(parsedData.data)
//           }

//           if (parsedData.type === "rateLimit") {
//             toast.error(parsedData.data)
//           }
//         })

//         setWs(ws)
//       }

//       connectWs()
//     }
//   }, [ws, url, setIsWsReady, setError])

//   useEffect(() => {
//     if (ws && ws.readyState === WebSocket.OPEN && session?.user) {
//       ws.send(
//         JSON.stringify({
//           type: "auth",
//           token: session.jwt,
//         }),
//       )
//     }
//   }, [session, ws])

//   useEffect(() => {
//     return () => {
//       if (ws instanceof WebSocket && ws.readyState === WebSocket.OPEN) {
//         ws.close()
//         console.log("[DEBUG] closed")
//       }
//     }
//   }, [ws])

//   return ws
// }