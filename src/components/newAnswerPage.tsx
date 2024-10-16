import { NewChatSearchBox } from "./newChatSearchBox";

export const NewAnswerPage = ({
    sendMessage,
    // focusMode,
    // setFocusMode,
}: {
    sendMessage: (message: string) => void;
    focusMode: string;
    setFocusMode: (mode: string) => void;
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-light-primary bg-black">
            <div className="w-full max-w-[70%] px-4">
                <div className="flex flex-col items-center justify-center space-y-8">
                    <h2 className="text-black dark:text-white text-5xl font-normal text-center pb-10">
                        Ask Anything
                    </h2>
                    <NewChatSearchBox
                        sendMessage={sendMessage}
                        // focusMode={focusMode}
                        // setFocusMode={setFocusMode}
                    />
                </div>
            </div>
        </div>
    );
};