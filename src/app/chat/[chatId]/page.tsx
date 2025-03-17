import { MainPage } from '@/components/mainPage';

const Page = ({ params }: { params: { chatId: string } }) => {
  return (
    <div>
      <p>{params.chatId}</p>
      <MainPage id={params.chatId} />
    </div>
  );
};

export default Page;
