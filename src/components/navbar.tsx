import { Clock, Trash, LogOut } from "lucide-react";
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
        <div className="fixed z-40 top-0 left-0 right-0 w-full flex items-center justify-between py-2 sm:py-4 px-2 sm:px-4 text-sm text-white dark:text-white/70 border-b bg-black dark:bg-dark-primary border-borderColour1 dark:border-borderColour1 border-opacity-40 dark:border-opacity-40">
          <div className="flex items-center space-x-2 min-w-[80px]">
            <Clock size={16} className="flex-shrink-0" />
            <p className="text-xs whitespace-nowrap">{timeAgo}</p>
          </div>
          
          <p className="max-w-[40%] sm:max-w-[50%] truncate text-center mx-2">{title}</p>
          
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-[80px] justify-end">
            <Trash
              size={16}
              className="text-red-400 active:scale-95 transition duration-100 cursor-pointer flex-shrink-0"
            />
            <LogOut
              size={16}
              onClick={() => signOut()}
              className="active:scale-95 transition duration-100 cursor-pointer flex-shrink-0"
            />
          </div>
        </div>
      );
};