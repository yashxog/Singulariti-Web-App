import { Edit, Clock, Share, Trash, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { formatTimeDifference } from "@/lib/utils";
import { Message } from "./mainPage";
import { signOut } from "next-auth/react";


export const Navbar = ({messages}: {messages: Message[]}) => {

    const [title, setTitle] = useState<string>("");
    const [timeAgo, setTimeAgo] = useState<string>("");
    
    useEffect(() => {
        if (messages.length > 0) {
            const newTitle = messages[0].content.length > 20 
                ? `${messages[0].content.substring(0, 20).trim()}...` 
                : messages[0].content;
            setTitle(newTitle);
            const newTimeAgo = formatTimeDifference(new Date(), new Date(messages[0].createdAt));
            setTimeAgo(newTimeAgo);
        }
    }, [messages]);

    useEffect(() => {
        const intervalId = setInterval(() => {
          if (messages.length > 0) {
            const newTimeAgo = formatTimeDifference(
              new Date(),
              messages[0].createdAt,
            );
            setTimeAgo(newTimeAgo);
          }
        }, 60000);

        return () => clearInterval(intervalId)
    }, []);

    return (
        <div className="fixed z-40 top-0 left-1/2 transform -translate-x-1/2 w-full max-w-screen-2xl flex items-center justify-between py-4 px-4 text-sm text-white dark:text-white/70 border-b bg-black dark:bg-dark-primary border-borderColour1 dark:border-borderColour1 border-opacity-40 dark:border-opacity-40">
          <div className="flex items-center space-x-2">
            <Clock size={17} />
            <p className="text-xs">{timeAgo}</p>
          </div>
          
          <p className="max-w-[50%] truncate text-center">{title}</p>
          
          <div className="flex items-center space-x-4">
            <Share
              size={17}
              className="active:scale-95 transition duration-100 cursor-pointer"
            />
            <Trash
              size={17}
              className="text-red-400 active:scale-95 transition duration-100 cursor-pointer"
            />
            <LogOut
              size={17}
              onClick={() => signOut()}
            />
          </div>
        </div>
      );
};