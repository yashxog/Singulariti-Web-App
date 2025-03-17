import { Clock, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { formatTimeDifference } from "@/lib/utils";
import { Message } from "@/types/dataTypes";
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
            if(messages[0].createdAt){
              const newTimeAgo = formatTimeDifference(new Date(), new Date(messages[0].createdAt));
              setTimeAgo(newTimeAgo);
            } else{
              const currentTime = new Date();
              const newTimeAgo = formatTimeDifference(new Date(), new Date(currentTime));
              setTimeAgo(newTimeAgo);
            }
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
        <div className="fixed z-40 top-0 left-1/2 transform -translate-x-1/2 w-full sm:max-w-screen-md md:max-w-screen-xl flex items-center justify-between py-4 px-4 text-sm text-charcoal dark:text-charcoal border-b bg-paper dark:bg-paper border-charcoal dark:border-charcoal border-opacity-40 dark:border-opacity-40">
          <div className="flex items-center space-x-2">
            <Clock size={17} />
            <p className="text-xs">{timeAgo}</p>
          </div>
          
          <p className="max-w-[50%] truncate text-center">{title}</p>
          
          <div className="flex items-center space-x-4">
            {/* <Trash
              size={17}
              className="text-red-400 active:scale-95 transition duration-100 cursor-pointer"
            /> */}

            <LogOut
              size={17}
              onClick={() => signOut()}
              className="active:scale-95 transition duration-100 cursor-pointer"
            />
          </div>
        </div>
      );
};