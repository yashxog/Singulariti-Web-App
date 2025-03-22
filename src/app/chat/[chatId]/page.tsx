// import { MainPage } from '@/components/mainPage';
import { Suspense } from 'react';
import { ChatPage } from '@/components/chatPage';

const Page = ({ params }: { params: { chatId: string } }) => {
  return (
    <div>
      <Suspense>
        <ChatPage chatId={params.chatId}/>
      </Suspense>
    </div>
  );
};

export default Page;
