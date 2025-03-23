import { NewChatSearchBox } from "./newChatSearchBox";
import cleanupUsername from "@/lib/usernameCleanup";

export const NewAnswerPage = ({
    sendMessage,
    toggleWebSocket,
    userName
    // focusMode,
    // setFocusMode,
}: {
    sendMessage: (message: string) => void;
    toggleWebSocket: () => void;
    userName: string | null;
    focusMode: string;
    setFocusMode: (mode: string) => void;
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-paper">
            <div className="w-full max-w-[70%] px-4">
                <div className="flex flex-col items-center justify-center space-y-8">
                    <h2 className="text-charcoal dark:text-charcoal text-5xl font-normal text-center pb-10 leading-snug">
                        {userName
                            ? (<>
                                 Hi, {cleanupUsername(userName)}
                                <br />
                                What can I do for you?
                            </>
                            ) : (
                                <>Hi, What can I do for you?</>
                            )
                        }
                    </h2>
                    <NewChatSearchBox
                        sendMessage={sendMessage}
                        toggleWebSocket={toggleWebSocket}
                        // focusMode={focusMode}
                        // setFocusMode={setFocusMode}
                    />
                </div>
            </div>
        </div>
    );
};